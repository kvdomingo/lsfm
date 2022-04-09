import os
from flask import Flask, send_from_directory
from .config import BASE_DIR, PYTHON_ENV
from .log import logger


app = Flask(__name__, static_url_path="", static_folder=BASE_DIR / "web" / "app")


@logger.catch
@app.route("/api")
async def health():
    return {"status": "ok"}


if PYTHON_ENV != "development":

    @logger.catch
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve(path: str):
        if path != "" and os.path.exists(f"{app.static_folder}/{path}"):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, "index.html")
