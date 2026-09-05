import https from 'node:https';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Stream audio with full HTTP 206 Partial Content Range support (for both local files and remote URLs)
 */
export const streamAudioFromUrl = async (audioUrl, req, res) => {
  try {
    // If audioUrl is a local or relative file path
    if (audioUrl.startsWith('/') || audioUrl.startsWith('./') || !audioUrl.startsWith('http')) {
      // Resolve path
      const baseFilename = path.basename(audioUrl);
      const possiblePaths = [
        path.resolve('server/public/audio', baseFilename),
        path.resolve('public/audio', baseFilename),
        path.resolve(audioUrl)
      ];

      const localFilePath = possiblePaths.find(p => fs.existsSync(p));

      if (localFilePath) {
        const stat = fs.statSync(localFilePath);
        const fileSize = stat.size;
        const range = req.headers.range;
        const ext = path.extname(localFilePath).toLowerCase();
        const contentType = ext === '.m4a' || ext === '.mp4' ? 'audio/mp4' : 'audio/mpeg';

        if (range) {
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
          const chunksize = (end - start) + 1;
          const file = fs.createReadStream(localFilePath, { start, end });
          const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*'
          };
          res.writeHead(206, head);
          file.pipe(res);
          return;
        } else {
          const head = {
            'Content-Length': fileSize,
            'Accept-Ranges': 'bytes',
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*'
          };
          res.writeHead(200, head);
          fs.createReadStream(localFilePath).pipe(res);
          return;
        }
      }
    }

    // Remote HTTP / HTTPS streaming
    const parsedUrl = new URL(audioUrl);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const requestHeaders = {
      'User-Agent': 'Resonance-Spotify-Audio-Service/2.0'
    };

    if (req.headers.range) {
      requestHeaders.range = req.headers.range;
    }

    const audioReq = client.request(
      audioUrl,
      {
        method: 'GET',
        headers: requestHeaders
      },
      (audioRes) => {
        // Forward response headers including Content-Range and Accept-Ranges
        const statusCode = audioRes.statusCode || 200;
        const responseHeaders = {
          'Content-Type': audioRes.headers['content-type'] || 'audio/mpeg',
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*'
        };

        if (audioRes.headers['content-range']) {
          responseHeaders['Content-Range'] = audioRes.headers['content-range'];
        }
        if (audioRes.headers['content-length']) {
          responseHeaders['Content-Length'] = audioRes.headers['content-length'];
        }

        res.writeHead(statusCode, responseHeaders);
        audioRes.pipe(res);
      }
    );

    audioReq.on('error', (err) => {
      console.error('Audio stream proxy error:', err);
      if (!res.headersSent) {
        res.status(502).json({ error: true, message: 'Failed to stream audio track from source.' });
      }
    });

    audioReq.end();
  } catch (err) {
    console.error('Stream setup error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: true, message: 'Internal audio stream error.' });
    }
  }
};
