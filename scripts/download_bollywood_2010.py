import subprocess
import os
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

SONGS = [
    {
        "id": "track-tera-hone-laga-hoon",
        "search": "Tera Hone Laga Hoon Ajab Prem Ki Ghazab Kahani official audio song",
        "title": "Tera Hone Laga Hoon",
        "artist": "Atif Aslam, Alisha Chinai",
        "album": "Ajab Prem Ki Ghazab Kahani",
        "year": 2009,
        "genre": "Romantic",
        "category": "acoustic"
    },
    {
        "id": "track-pee-loon",
        "search": "Pee Loon Once Upon A Time in Mumbaai official audio song",
        "title": "Pee Loon",
        "artist": "Mohit Chauhan",
        "album": "Once Upon a Time in Mumbaai",
        "year": 2010,
        "genre": "Sufi Romantic",
        "category": "acoustic"
    },
    {
        "id": "track-sheila-ki-jawani",
        "search": "Sheila Ki Jawani Tees Maar Khan full song audio",
        "title": "Sheila Ki Jawani",
        "artist": "Sunidhi Chauhan, Vishal Dadlani",
        "album": "Tees Maar Khan",
        "year": 2010,
        "genre": "Dance / Item",
        "category": "electric"
    },
    {
        "id": "track-munni-badnaam",
        "search": "Munni Badnaam Hui Dabangg official audio song",
        "title": "Munni Badnaam Hui",
        "artist": "Mamta Sharma, Aishwarya Nigam",
        "album": "Dabangg",
        "year": 2010,
        "genre": "Desi Dance",
        "category": "electric"
    },
    {
        "id": "track-tere-mast-mast",
        "search": "Tere Mast Mast Do Nain Dabangg official audio song",
        "title": "Tere Mast Mast Do Nain",
        "artist": "Rahat Fateh Ali Khan, Shreya Ghoshal",
        "album": "Dabangg",
        "year": 2010,
        "genre": "Sufi / Romance",
        "category": "acoustic"
    },
    {
        "id": "track-dil-kyun-yeh-mera",
        "search": "Dil Kyun Yeh Mera Kites KK official audio song",
        "title": "Dil Kyun Yeh Mera",
        "artist": "KK",
        "album": "Kites",
        "year": 2010,
        "genre": "Ballad / Acoustic",
        "category": "acoustic"
    },
    {
        "id": "track-aadha-ishq",
        "search": "Aadha Ishq Band Baaja Baaraat official audio song",
        "title": "Aadha Ishq",
        "artist": "Shreya Ghoshal, Natalie Di Luccio",
        "album": "Band Baaja Baaraat",
        "year": 2010,
        "genre": "Romantic Acoustic",
        "category": "acoustic"
    },
    {
        "id": "track-bin-tere",
        "search": "Bin Tere I Hate Luv Storys official audio song Shafqat",
        "title": "Bin Tere",
        "artist": "Shafqat Amanat Ali, Sunidhi Chauhan",
        "album": "I Hate Luv Storys",
        "year": 2010,
        "genre": "Sufi Rock / Pop",
        "category": "acoustic"
    },
    {
        "id": "track-sadka-kiya",
        "search": "Sadka Kiya I Hate Luv Storys official audio song",
        "title": "Sadka Kiya",
        "artist": "Shaan, Mahalakshmi Iyer",
        "album": "I Hate Luv Storys",
        "year": 2010,
        "genre": "Romantic Pop",
        "category": "acoustic"
    },
    {
        "id": "track-ihls-title",
        "search": "I Hate Luv Storys title track official audio Vishal Dadlani",
        "title": "I Hate Luv Storys",
        "artist": "Vishal Dadlani",
        "album": "I Hate Luv Storys",
        "year": 2010,
        "genre": "Pop / Dance",
        "category": "electric"
    },
    {
        "id": "track-zindagi-do-pal-ki",
        "search": "Zindagi Do Pal Ki Kites KK official audio song",
        "title": "Zindagi Do Pal Ki",
        "artist": "KK",
        "album": "Kites",
        "year": 2010,
        "genre": "Melodic Acoustic",
        "category": "acoustic"
    },
    {
        "id": "track-chori-kiya-re-jiya",
        "search": "Chori Kiya Re Jiya Dabangg official audio song",
        "title": "Chori Kiya Re Jiya",
        "artist": "Sonu Nigam, Shreya Ghoshal",
        "album": "Dabangg",
        "year": 2010,
        "genre": "Romantic",
        "category": "acoustic"
    },
    {
        "id": "track-sajde",
        "search": "Sajde Khatta Meetha KK Sunidhi Chauhan official audio",
        "title": "Sajde",
        "artist": "KK, Sunidhi Chauhan",
        "album": "Khatta Meetha",
        "year": 2010,
        "genre": "Rock / Ballad",
        "category": "electric"
    },
    {
        "id": "track-aapka-kya-hoga-dhanno",
        "search": "Aapka Kya Hoga Dhanno Housefull official audio song",
        "title": "Aapka Kya Hoga (Dhanno)",
        "artist": "Mika Singh, Sunidhi Chauhan, Sajid Khan",
        "album": "Housefull",
        "year": 2010,
        "genre": "Party / Dance",
        "category": "electric"
    },
    {
        "id": "track-ainvayi-ainvayi",
        "search": "Ainvayi Ainvayi Band Baaja Baaraat official audio song",
        "title": "Ainvayi Ainvayi",
        "artist": "Salim Merchant, Sunidhi Chauhan",
        "album": "Band Baaja Baaraat",
        "year": 2010,
        "genre": "Wedding Dance",
        "category": "electric"
    }
]

def download_song(song):
    track_id = song["id"]
    query = song["search"]
    output_path = f"public/audio/{track_id}.m4a"
    raw_path = f"public/audio/{track_id}_raw.m4a"

    if os.path.exists(output_path) and os.path.getsize(output_path) > 1000000:
        print(f"✅ Already downloaded: {song['title']}")
        return True

    print(f"⏳ Downloading: {song['title']}...")
    try:
        # 1. Download best audio m4a using yt-dlp
        cmd = [
            "./.venv/bin/yt-dlp",
            "-f", "ba[ext=m4a]/ba/b",
            "--default-search", "ytsearch",
            "-o", raw_path,
            f"ytsearch1:{query}"
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=90)
        if res.returncode != 0 or not os.path.exists(raw_path):
            print(f"❌ Failed download for {song['title']}: {res.stderr}")
            return False

        # 2. Convert with Apple afconvert to clean 256k AAC
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
            # If afconvert fails, just rename raw_path to output_path
            os.rename(raw_path, output_path)
            print(f"⚠️ Done (raw): {song['title']}")
            return True
    except Exception as e:
        print(f"❌ Error downloading {song['title']}: {e}")
        return False

def main():
    os.makedirs("public/audio", exist_ok=True)
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(download_song, s): s for s in SONGS}
        for future in as_completed(futures):
            future.result()

if __name__ == "__main__":
    main()
