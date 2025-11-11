import os
from supabase import create_client, Client
from dotenv import load_dotenv
import uuid
from datetime import datetime

load_dotenv()

# Environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
BIN_ID = os.getenv("BIN_ID", "unknown_bin")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Supabase credentials not set in environment (.env)")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

detection_id = (
    f"detection-{datetime.now().strftime('%Y%m%d%H%M%S')}-{uuid.uuid4().hex[:6]}"
)


def upload_detection_image(image_bytes, class_name, confidence, timestamp):
    """
    Uploads image bytes directly to Supabase Storage (no local file).
    Also logs detection info into the 'detections_log' table.
    """
    try:
        bucket = "detections"
        file_name = f"detection_{timestamp.replace(':', '-')}.jpg"

        # --- Upload image bytes directly ---
        supabase.storage.from_(bucket).upload(
            file_name, image_bytes, {"x-upsert": "true"}
        )

        # Get public URL
        image_url = supabase.storage.from_(bucket).get_public_url(file_name)

        # --- Generate detection ID ---
        count_result = (
            supabase.table("detections_log").select("id", count="exact").execute()
        )

        # --- Insert metadata into detections_log table ---
        row = {
            "detection_id": detection_id,
            "bin_id": BIN_ID,
            "class": class_name,
            "confidence": float(confidence),
            "timestamp": timestamp,
            "image_url": image_url,
        }
        supabase.table("detections_log").insert(row).execute()

        safe_row = {
            k: (
                str(v).encode("utf-8", "ignore").decode("utf-8")
                if isinstance(v, str)
                else v
            )
            for k, v in row.items()
        }

        print(f"[SUPABASE] Uploaded {file_name} -> {detection_id}")
        return image_url

    except Exception as e:
        print(f"[SUPABASE ERROR] {e}")
        return None
