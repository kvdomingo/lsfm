import sys
import subprocess
from tqdm import tqdm


def download(index: int) -> None:
    pbar = tqdm(total=29)
    for i in range(1, 11):
        subprocess.run(
            f"curl -X GET https://le-sserafim.com/res/last/{index}/moving_image/Photocard_Visual_Moving_{index + 1}_{i}.mp4 -o Photocard_Visual_Moving_{index + 1}_{i}.mp4",
            shell=True,
            capture_output=True,
        )
        subprocess.run(
            f"curl -X GET https://le-sserafim.com/res/last/{index}/fix_image/Photocard_Visual_{index + 1}_{i}.png -o Photocard_Visual_{index + 1}_{i}.png",
            shell=True,
            capture_output=True,
        )
        pbar.update()

    for i in range(1, 7):
        for c in ["b", "w"]:
            subprocess.run(
                f"curl -X GET https://le-sserafim.com/res/last/{index}/text/Photocard_Text_{index + 1}_{i}_{c}.png -o Photocard_Text_{index + 1}_{i}_{c}.png",
                shell=True,
                capture_output=True,
            )
        pbar.update()

    desc = [
        "intro",
        "killing_part",
        "message_kr_1",
        "message_kr_2",
        "message_kr_3",
        "message_jp",
        "message_en",
    ]
    for i in range(len(desc)):
        subprocess.run(
            f"curl -X GET https://le-sserafim.com/res/last/{index}/auditory/auditory_{i}.mp3 -o auditory_{i}_{desc[i]}.mp3",
            shell=True,
            capture_output=True,
        )
        pbar.update()


if __name__ == "__main__":
    download(int(sys.argv[1]))
