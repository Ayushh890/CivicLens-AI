import os
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME", "demo"),
    api_key=os.getenv("CLOUDINARY_API_KEY", ""),
    api_secret=os.getenv("CLOUDINARY_API_SECRET", ""),
)


def upload_photo(base64_data: str) -> str | None:
    if not base64_data:
        return None

    try:
        if not base64_data.startswith("data:"):
            base64_data = f"data:image/jpeg;base64,{base64_data}"

        result = cloudinary.uploader.upload(
            base64_data,
            folder="civiclens",
            resource_type="image",
            transformation=[
                {"width": 1200, "height": 900, "crop": "limit"},
                {"quality": "auto", "fetch_format": "auto"},
            ],
        )
        return result.get("secure_url")
    except Exception:
        return None
