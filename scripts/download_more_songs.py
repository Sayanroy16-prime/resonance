import subprocess
import os
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

NEW_SONGS = [
    # ── POP ──
    {
        "id": "track-subah-hone-na-de",
        "search": "Subah Hone Na De Desi Boyz official full audio song",
        "title": "Subah Hone Na De",
        "artist": "Mika Singh, Shefali Alvares",
        "album": "Desi Boyz",
        "year": 2011,
        "genre": "Pop / Dance",
        "category": "electric"
    },
    {
        "id": "track-badtameez-dil",
        "search": "Badtameez Dil Yeh Jawaani Hai Deewani official audio song",
        "title": "Badtameez Dil",
        "artist": "Benny Dayal, Shefali Alvares",
        "album": "Yeh Jawaani Hai Deewani",
        "year": 2013,
        "genre": "Party Pop",
        "category": "electric"
    },
    {
        "id": "track-ilahi",
        "search": "Ilahi Yeh Jawaani Hai Deewani official audio song Arijit Singh",
        "title": "Ilahi",
        "artist": "Arijit Singh",
        "album": "Yeh Jawaani Hai Deewani",
        "year": 2013,
        "genre": "Pop / Acoustic",
        "category": "acoustic"
    },

    # ── JAZZ / SOUL ──
    {
        "id": "track-kaisi-paheli-zindagani",
        "search": "Kaisi Paheli Zindagani Parineeta official audio song Sunidhi Chauhan",
        "title": "Kaisi Paheli Zindagani",
        "artist": "Sunidhi Chauhan",
        "album": "Parineeta",
        "year": 2005,
        "genre": "Jazz / Cabaret",
        "category": "acoustic"
    },
    {
        "id": "track-musafir-hoon-yaaron",
        "search": "Musafir Hoon Yaaron Parichay official audio Kishore Kumar",
        "title": "Musafir Hoon Yaaron",
        "artist": "Kishore Kumar, R.D. Burman",
        "album": "Parichay",
        "year": 1972,
        "genre": "Acoustic Jazz / Folk",
        "category": "acoustic"
    },
    {
        "id": "track-fly-me-to-the-moon",
        "search": "Fly Me To The Moon Frank Sinatra Count Basie official audio",
        "title": "Fly Me to the Moon",
        "artist": "Frank Sinatra, Count Basie",
        "album": "It Might as Well Be Swing",
        "year": 1964,
        "genre": "Jazz Standard",
        "category": "acoustic"
    },

    # ── CLASSIC ──
    {
        "id": "track-kun-faya-kun",
        "search": "Kun Faya Kun Rockstar official audio AR Rahman Mohit Chauhan",
        "title": "Kun Faya Kun",
        "artist": "A.R. Rahman, Mohit Chauhan, Javed Ali",
        "album": "Rockstar",
        "year": 2011,
        "genre": "Sufi Classical",
        "category": "acoustic"
    },
    {
        "id": "track-tum-se-hi",
        "search": "Tum Se Hi Jab We Met official audio song Mohit Chauhan",
        "title": "Tum Se Hi",
        "artist": "Mohit Chauhan",
        "album": "Jab We Met",
        "year": 2007,
        "genre": "Romantic Classic",
        "category": "acoustic"
    },
    {
        "id": "track-tujhe-dekha-toh",
        "search": "Tujhe Dekha Toh Yeh Jaana Sanam DDLJ official audio song Kumar Sanu",
        "title": "Tujhe Dekha Toh",
        "artist": "Kumar Sanu, Lata Mangeshkar",
        "album": "Dilwale Dulhania Le Jayenge",
        "year": 1995,
        "genre": "Bollywood Classic",
        "category": "acoustic"
    },

    # ── ROCK ──
    {
        "id": "track-sadda-haq",
        "search": "Sadda Haq Rockstar official audio song Mohit Chauhan",
        "title": "Sadda Haq",
        "artist": "Mohit Chauhan, A.R. Rahman, Orianthi",
        "album": "Rockstar",
        "year": 2011,
        "genre": "Stadium Rock",
        "category": "electric"
    },
    {
        "id": "track-bhaag-dk-bose",
        "search": "Bhaag D.K. Bose Delhi Belly official audio song",
        "title": "Bhaag D.K. Bose",
        "artist": "Ram Sampath",
        "album": "Delhi Belly",
        "year": 2011,
        "genre": "Punk Rock",
        "category": "electric"
    },
    {
        "id": "track-rock-on-title",
        "search": "Rock On title song Farhan Akhtar official audio",
        "title": "Rock On!!",
        "artist": "Farhan Akhtar",
        "album": "Rock On!!",
        "year": 2008,
        "genre": "Hard Rock",
        "category": "electric"
    }
]

def download_song(song):
    track_id = song["id"]
    query = song["search"]
    output_path = f"public/audio/{track_id}.m4a"
    raw_path = f"public/audio/{track_id}_raw.m4a"

    if os.path.exists(output_path) and os.path.getsize(output_path) > 1000000:
        print(f"✅ Already exists: {song['title']}")
        return True

    print(f"⏳ Downloading: {song['title']}...")
    try:
        cmd = [
            "./.venv/bin/yt-dlp",
            "-f", "ba[ext=m4a]/ba/b",
            "--default-search", "ytsearch",
            "-o", raw_path,
            f"ytsearch1:{query}"
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        if res.returncode != 0 or not os.path.exists(raw_path):
            print(f"❌ Failed yt-dlp download for {song['title']}: {res.stderr[:200]}")
            return False

        # Convert to pristine 256kbps stereo AAC via Apple CoreAudio afconvert
        conv_cmd = [
            "afconvert",
            raw_path,
            "-o", output_path,
            "-f", "m4af",
            "-d", "aac",
            "-b", "256000"
        ]
        cres = subprocess.run(conv_cmd, capture_output=True, text=True, timeout=30)
        if cres.returncode == 0 and os.path.exists(output_path):
            if os.path.exists(raw_path):
                os.remove(raw_path)
            size_mb = os.path.getsize(output_path) / (1024 * 1024)
            print(f"🎉 Done: {song['title']} ({size_mb:.2f} MB)")
            return True
        else:
            os.rename(raw_path, output_path)
            print(f"⚠️ Done (raw): {song['title']}")
            return True
    except Exception as e:
        print(f"❌ Error downloading {song['title']}: {e}")
        return False

def main():
    os.makedirs("public/audio", exist_ok=True)
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = {executor.submit(download_song, s): s for s in NEW_SONGS}
        for future in as_completed(futures):
            future.result()

if __name__ == "__main__":
    main()
