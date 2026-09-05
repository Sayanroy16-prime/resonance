import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

void main() {
  runApp(const ResonanceMaroonApp());
}

/// Dynamic Maroon Theme Palette
class MaroonTheme {
  static const Color bgObsidianMaroon = Color(0xFF1A0507);
  static const Color bgSurfaceMaroon = Color(0xFF2B080C);
  static const Color bgCardMaroon = Color(0xFF3D0D13);
  static const Color bgCardHover = Color(0xFF4F121A);

  static const Color accentCrimson = Color(0xFFE63946);
  static const Color accentGold = Color(0xFFD4AF37);
  static const Color accentRoseGold = Color(0xFFE0A96D);

  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFFD1A3A8);
  static const Color textMuted = Color(0xFF8C5C62);

  static ThemeData get themeData {
    return ThemeData.dark().copyWith(
      scaffoldBackgroundColor: bgObsidianMaroon,
      primaryColor: accentCrimson,
      colorScheme: const ColorScheme.dark(
        primary: accentCrimson,
        secondary: accentGold,
        surface: bgSurfaceMaroon,
        background: bgObsidianMaroon,
      ),
      textTheme: GoogleFonts.outfitTextTheme(ThemeData.dark().textTheme).apply(
        bodyColor: textPrimary,
        displayColor: textPrimary,
      ),
    );
  }
}

/// Track Data Model
class Track {
  final String id;
  final String title;
  final String artist;
  final String album;
  final int durationSeconds;
  final String coverUrl;
  final String genre;

  Track({
    required this.id,
    required this.title,
    required this.artist,
    required this.album,
    required this.durationSeconds,
    required this.coverUrl,
    required this.genre,
  });
}

/// App Data Catalog
final List<Track> mockTracks = [
  Track(
    id: 'track-1',
    title: 'Midnight Crimson Lights',
    artist: 'Aetheria',
    album: 'Maroon Horizons',
    durationSeconds: 215,
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    genre: 'Synthwave',
  ),
  Track(
    id: 'track-2',
    title: 'Velvet Lofi Session',
    artist: 'Komorebi Beats',
    album: 'Maroon Cafe',
    durationSeconds: 184,
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
    genre: 'Lofi',
  ),
  Track(
    id: 'track-3',
    title: 'Cybernetic Burgundy',
    artist: 'Vector Prime',
    album: 'Cyber City 2099',
    durationSeconds: 242,
    coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    genre: 'Cyberpunk',
  ),
  Track(
    id: 'track-4',
    title: 'Quantum Resonance',
    artist: 'Solaris Unit',
    album: 'Quantum Dreams',
    durationSeconds: 198,
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    genre: 'Electronic',
  ),
  Track(
    id: 'track-5',
    title: 'Deep Focus Maroon Waves',
    artist: 'Mindwave Lab',
    album: 'Deep Focus Frequency',
    durationSeconds: 260,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    genre: 'Ambient',
  ),
];

class UserProfile {
  final String name;
  final String detail; // Email or Phone
  final String provider;
  final String avatarUrl;

  UserProfile({
    required this.name,
    required this.detail,
    required this.provider,
    required this.avatarUrl,
  });
}

/// Root Application
class ResonanceMaroonApp extends StatefulWidget {
  const ResonanceMaroonApp({super.key});

  @override
  State<ResonanceMaroonApp> createState() => _ResonanceMaroonAppState();
}

class _ResonanceMaroonAppState extends State<ResonanceMaroonApp> {
  UserProfile? currentUser;

  // Navigation State
  int currentTabIndex = 0;

  // Playback Engine State
  Track currentTrack = mockTracks[0];
  bool isPlaying = false;
  double playbackPosition = 0.0;
  List<Track> queue = [mockTracks[1], mockTracks[2]];
  Set<String> downloadedTrackIds = {};
  Set<String> likedTrackIds = {};
  bool isOfflineMode = false;

  Timer? _playbackTimer;

  @override
  void initState() {
    super.initState();
    _startPlaybackTimer();
  }

  void _startPlaybackTimer() {
    _playbackTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (isPlaying) {
        setState(() {
          if (playbackPosition < currentTrack.durationSeconds) {
            playbackPosition += 1.0;
          } else {
            playbackPosition = 0.0;
            _playNextTrack();
          }
        });
      }
    });
  }

  @override
  void dispose() {
    _playbackTimer?.cancel();
    super.dispose();
  }

  void _playNextTrack() {
    if (queue.isNotEmpty) {
      setState(() {
        currentTrack = queue.removeAt(0);
        playbackPosition = 0.0;
        isPlaying = true;
      });
    } else {
      setState(() {
        final nextIndex = (mockTracks.indexOf(currentTrack) + 1) % mockTracks.length;
        currentTrack = mockTracks[nextIndex];
        playbackPosition = 0.0;
        isPlaying = true;
      });
    }
  }

  void _togglePlayPause() {
    setState(() {
      isPlaying = !isPlaying;
    });
  }

  void _playTrack(Track track) {
    setState(() {
      currentTrack = track;
      playbackPosition = 0.0;
      isPlaying = true;
    });
  }

  void _toggleDownload(Track track) {
    setState(() {
      if (downloadedTrackIds.contains(track.id)) {
        downloadedTrackIds.remove(track.id);
      } else {
        downloadedTrackIds.add(track.id);
      }
    });
  }

  void _toggleLike(Track track) {
    setState(() {
      if (likedTrackIds.contains(track.id)) {
        likedTrackIds.remove(track.id);
      } else {
        likedTrackIds.add(track.id);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Resonance Maroon',
      debugShowCheckedModeBanner: false,
      theme: MaroonTheme.themeData,
      home: currentUser == null
          ? AuthScreen(
              onLoginSuccess: (user) {
                setState(() {
                  currentUser = user;
                });
              },
            )
          : Scaffold(
              body: Column(
                children: [
                  // App Navbar
                  _buildNavbar(),
                  // Main View Content
                  Expanded(
                    child: IndexedStack(
                      index: currentTabIndex,
                      children: [
                        _buildHomeView(),
                        _buildSearchView(),
                        _buildLibraryView(),
                        _buildDownloadedView(),
                      ],
                    ),
                  ),
                  // Persistent Player Bar
                  _buildPlayerBar(),
                ],
              ),
              bottomNavigationBar: BottomNavigationBar(
                currentIndex: currentTabIndex,
                backgroundColor: MaroonTheme.bgSurfaceMaroon,
                selectedItemColor: MaroonTheme.accentCrimson,
                unselectedItemColor: MaroonTheme.textMuted,
                type: BottomNavigationBarType.fixed,
                onTap: (index) {
                  setState(() {
                    currentTabIndex = index;
                  });
                },
                items: const [
                  BottomNavigationBarItem(icon: Icon(Icons.home_filled), label: 'Home'),
                  BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Search'),
                  BottomNavigationBarItem(icon: Icon(Icons.library_music), label: 'Library'),
                  BottomNavigationBarItem(icon: Icon(Icons.download_for_offline), label: 'Offline'),
                ],
              ),
            ),
    );
  }

  Widget _buildNavbar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      color: MaroonTheme.bgSurfaceMaroon,
      child: SafeArea(
        bottom: false,
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: MaroonTheme.accentCrimson,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.radio, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'RESONANCE',
                  style: GoogleFonts.outfit(
                    fontWeight: FontWeight.extrabold,
                    fontSize: 16,
                    color: Colors.white,
                    letterSpacing: 1.2,
                  ),
                ),
                Text(
                  'MAROON EDITION',
                  style: GoogleFonts.outfit(
                    fontWeight: FontWeight.bold,
                    fontSize: 9,
                    color: MaroonTheme.accentGold,
                    letterSpacing: 2,
                  ),
                ),
              ],
            ),
            const Spacer(),
            // Network Simulator Switch
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: isOfflineMode
                    ? Colors.amber.withOpacity(0.2)
                    : MaroonTheme.accentCrimson.withOpacity(0.2),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: isOfflineMode ? Colors.amber : MaroonTheme.accentCrimson,
                  width: 1,
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    isOfflineMode ? Icons.wifi_off : Icons.wifi,
                    size: 14,
                    color: isOfflineMode ? Colors.amber : MaroonTheme.accentCrimson,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    isOfflineMode ? 'OFFLINE' : 'ONLINE',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: isOfflineMode ? Colors.amber : MaroonTheme.accentCrimson,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 10),
            // User Avatar & Logout Menu
            GestureDetector(
              onTap: () {
                setState(() {
                  currentUser = null;
                });
              },
              child: CircleAvatar(
                radius: 16,
                backgroundImage: NetworkImage(currentUser!.avatarUrl),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHomeView() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(
          'Good Evening',
          style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        // Hero Tiles Grid
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            childAspectRatio: 3,
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
          ),
          itemCount: min(4, mockTracks.length),
          itemBuilder: (context, index) {
            final track = mockTracks[index];
            return InkWell(
              onTap: () => _playTrack(track),
              child: Container(
                decoration: BoxDecoration(
                  color: MaroonTheme.bgCardMaroon,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    ClipRRect(
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(8),
                        bottomLeft: Radius.circular(8),
                      ),
                      child: Image.network(
                        track.coverUrl,
                        width: 50,
                        height: 50,
                        fit: BoxFit.cover,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        track.title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
        const SizedBox(height: 24),
        Text(
          'Trending Maroon Tracks',
          style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 180,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: mockTracks.length,
            itemBuilder: (context, index) {
              final track = mockTracks[index];
              return Container(
                width: 130,
                margin: const EdgeInsets.only(right: 12),
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: MaroonTheme.bgCardMaroon,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(
                        track.coverUrl,
                        height: 100,
                        width: 120,
                        fit: BoxFit.cover,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      track.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                    Text(
                      track.artist,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(color: MaroonTheme.textMuted, fontSize: 10),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildSearchView() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextField(
            decoration: InputDecoration(
              hintText: 'Search tracks, artists, or genres...',
              hintStyle: const TextStyle(color: MaroonTheme.textMuted),
              prefixIcon: const Icon(Icons.search, color: MaroonTheme.accentCrimson),
              filled: true,
              fillColor: MaroonTheme.bgCardMaroon,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(30),
                borderSide: BorderSide.none,
              ),
            ),
          ),
          const SizedBox(height: 20),
          Expanded(
            child: ListView.builder(
              itemCount: mockTracks.length,
              itemBuilder: (context, index) {
                final track = mockTracks[index];
                final isDownloaded = downloadedTrackIds.contains(track.id);
                final isLiked = likedTrackIds.contains(track.id);

                return ListTile(
                  leading: ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: Image.network(track.coverUrl, width: 44, height: 44, fit: BoxFit.cover),
                  ),
                  title: Text(track.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  subtitle: Text(track.artist, style: const TextStyle(color: MaroonTheme.textMuted, fontSize: 11)),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        icon: Icon(
                          isLiked ? Icons.favorite : Icons.favorite_border,
                          color: isLiked ? Colors.redAccent : MaroonTheme.textMuted,
                          size: 20,
                        ),
                        onPressed: () => _toggleLike(track),
                      ),
                      IconButton(
                        icon: Icon(
                          isDownloaded ? Icons.check_circle : Icons.download_outlined,
                          color: isDownloaded ? MaroonTheme.accentCrimson : MaroonTheme.textMuted,
                          size: 20,
                        ),
                        onPressed: () => _toggleDownload(track),
                      ),
                    ],
                  ),
                  onTap: () => _playTrack(track),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLibraryView() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        ListTile(
          leading: Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [MaroonTheme.accentCrimson, Colors.purple]),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.favorite, color: Colors.white),
          ),
          title: const Text('Liked Songs', style: TextStyle(fontWeight: FontWeight.bold)),
          subtitle: Text('${likedTrackIds.length} tracks'),
        ),
        ListTile(
          leading: Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: MaroonTheme.bgCardMaroon,
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.download_done, color: MaroonTheme.accentGold),
          ),
          title: const Text('Downloaded Offline', style: TextStyle(fontWeight: FontWeight.bold)),
          subtitle: Text('${downloadedTrackIds.length} cached tracks'),
        ),
      ],
    );
  }

  Widget _buildDownloadedView() {
    final downloadedTracks = mockTracks.where((t) => downloadedTrackIds.contains(t.id)).toList();

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: MaroonTheme.bgCardMaroon,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: MaroonTheme.accentCrimson.withOpacity(0.3)),
            ),
            child: Row(
              children: [
                const Icon(Icons.sd_storage, color: MaroonTheme.accentGold, size: 32),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('IndexedDB Offline Storage', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    Text('${(downloadedTracks.length * 1.68).toStringAsFixed(2)} MB Cached Audio', style: const TextStyle(color: MaroonTheme.textMuted, fontSize: 11)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: downloadedTracks.isEmpty
                ? const Center(child: Text('No tracks downloaded yet.'))
                : ListView.builder(
                    itemCount: downloadedTracks.length,
                    itemBuilder: (context, index) {
                      final track = downloadedTracks[index];
                      return ListTile(
                        leading: Image.network(track.coverUrl, width: 40, height: 40, fit: BoxFit.cover),
                        title: Text(track.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                        subtitle: const Text('1.68 MB • Offline Blob', style: TextStyle(color: MaroonTheme.accentCrimson, fontSize: 11)),
                        trailing: const Icon(Icons.check_circle, color: MaroonTheme.accentCrimson),
                        onTap: () => _playTrack(track),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlayerBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      color: MaroonTheme.bgCardMaroon,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Waveform Visualizer
          SizedBox(
            height: 24,
            width: double.infinity,
            child: CustomPaint(
              painter: WaveformPainter(isPlaying: isPlaying),
            ),
          ),
          const SizedBox(height: 4),
          Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(6),
                child: Image.network(currentTrack.coverUrl, width: 44, height: 44, fit: BoxFit.cover),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      currentTrack.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                    Text(
                      currentTrack.artist,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(color: MaroonTheme.textMuted, fontSize: 10),
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: Icon(
                  isPlaying ? Icons.pause_circle_filled : Icons.play_circle_filled,
                  color: MaroonTheme.accentCrimson,
                  size: 36,
                ),
                onPressed: _togglePlayPause,
              ),
              IconButton(
                icon: const Icon(Icons.skip_next, color: Colors.white, size: 24),
                onPressed: _playNextTrack,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

/// Custom Waveform Spectrum Painter
class WaveformPainter extends CustomPainter {
  final bool isPlaying;

  WaveformPainter({required this.isPlaying});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = MaroonTheme.accentCrimson
      ..strokeCap = StrokeCap.round
      ..strokeWidth = 3;

    const numBars = 24;
    final barSpacing = size.width / numBars;

    for (int i = 0; i < numBars; i++) {
      final heightFactor = isPlaying
          ? (0.2 + 0.8 * sin(i + DateTime.now().millisecondsSinceEpoch / 150).abs())
          : 0.15;
      final barHeight = size.height * heightFactor;
      final x = i * barSpacing + 2;
      final yTop = size.height - barHeight;

      canvas.drawLine(Offset(x, size.height), Offset(x, yTop), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}

/// Authentication Screen Widget
class AuthScreen extends StatefulWidget {
  final Function(UserProfile) onLoginSuccess;

  const AuthScreen({super.key, required this.onLoginSuccess});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool isPhoneAuth = false;
  bool isOtpStep = false;
  final TextEditingController _phoneController = TextEditingController();
  final List<TextEditingController> _otpControllers = List.generate(6, (_) => TextEditingController());

  void _handleGoogleLogin() {
    widget.onLoginSuccess(
      UserProfile(
        name: 'Audiophile User',
        detail: 'user@gmail.com',
        provider: 'Google Account',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      ),
    );
  }

  void _handlePhoneVerify() {
    widget.onLoginSuccess(
      UserProfile(
        name: 'Audio Enthusiast (+1 3210)',
        detail: '+1 ${_phoneController.text}',
        provider: 'Phone Verification',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [MaroonTheme.bgSurfaceMaroon, MaroonTheme.bgObsidianMaroon],
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: MaroonTheme.accentCrimson,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Icon(Icons.radio, color: Colors.white, size: 40),
                ),
                const SizedBox(height: 16),
                Text(
                  'RESONANCE',
                  style: GoogleFonts.outfit(
                    fontSize: 28,
                    fontWeight: FontWeight.extrabold,
                    color: Colors.white,
                    letterSpacing: 2,
                  ),
                ),
                Text(
                  'MAROON EDITION & OFFLINE',
                  style: GoogleFonts.outfit(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: MaroonTheme.accentGold,
                    letterSpacing: 3,
                  ),
                ),
                const SizedBox(height: 32),
                // Toggle Tabs
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: !isPhoneAuth ? MaroonTheme.accentCrimson : MaroonTheme.bgCardMaroon,
                        ),
                        onPressed: () => setState(() => isPhoneAuth = false),
                        child: const Text('Google / Gmail'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: isPhoneAuth ? MaroonTheme.accentCrimson : MaroonTheme.bgCardMaroon,
                        ),
                        onPressed: () => setState(() => isPhoneAuth = true),
                        child: const Text('Phone & OTP'),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                if (!isPhoneAuth) ...[
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: Colors.black,
                      minimumSize: const Size(double.infinity, 50),
                    ),
                    icon: const Icon(Icons.g_mobiledata, size: 28),
                    label: const Text('Continue with Google Account', style: TextStyle(fontWeight: FontWeight.bold)),
                    onPressed: _handleGoogleLogin,
                  ),
                ] else ...[
                  if (!isOtpStep) ...[
                    TextField(
                      controller: _phoneController,
                      keyboardType: TextInputType.phone,
                      decoration: InputDecoration(
                        hintText: '+1 987 654 3210',
                        filled: true,
                        fillColor: MaroonTheme.bgCardMaroon,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: MaroonTheme.accentCrimson,
                        minimumSize: const Size(double.infinity, 50),
                      ),
                      onPressed: () => setState(() => isOtpStep = true),
                      child: const Text('Send 6-Digit OTP Code'),
                    ),
                  ] else ...[
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: List.generate(
                        6,
                        (index) => SizedBox(
                          width: 40,
                          child: TextField(
                            controller: _otpControllers[index],
                            textAlign: TextAlign.center,
                            keyboardType: TextInputType.number,
                            maxLength: 1,
                            decoration: const InputDecoration(counterText: ''),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: MaroonTheme.accentCrimson,
                        minimumSize: const Size(double.infinity, 50),
                      ),
                      onPressed: _handlePhoneVerify,
                      child: const Text('Verify & Enter Studio'),
                    ),
                  ],
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
