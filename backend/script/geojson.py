import pandas as pd
import numpy as np
import json
import os
from pathlib import Path


# paths
RAW_CSV_DIR = Path("data/raw_csv")
GEOJSON_DIR = Path("data/processed_geojson")
EXCEL_METADATA_PATH = Path("../data/vessel_list/Arctic_Vessel_List.xlsx")

vessel_df = pd.read_excel(EXCEL_METADATA_PATH)

# lookup dictionary
vessel_lookup = {}
for _, row in vessel_df.iterrows():
    key = (str(row.get("MMSI")).strip(), str(row.get("Name")).strip())
    vessel_lookup[key] = {
        "country": row.get("Country"),
        "duration": row.get("Duration"),
        "distance": row.get("Distance [Nm]")
    }

def safe_get(row, key):
    val = row.get(key)
    return val if pd.notna(val) else None

def csv_to_geojson(csv_path, geojson_path):
    df = pd.read_csv(csv_path)

    features = []
    for _, row in df.iterrows():
        if pd.isna(row.get('lon')) or pd.isna(row.get('lat')):
            continue  # skip rows with no location

        mmsi_key = str(safe_get(row, 'mmsi')).strip()
        name_key = str(safe_get(row, 'name')).strip()
        meta = vessel_lookup.get((mmsi_key, name_key), {})

        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [float(row['lon']), float(row['lat'])]
            },
            "properties": {
                "timestamp": safe_get(row, 'bs_ts'),
                "mmsi": mmsi_key,
                "name": safe_get(row, 'name'),
                "callsign": safe_get(row, 'callsign'),
                "nav_status": safe_get(row, 'nav_status'),
                "sog": safe_get(row, 'sog'),
                "cog": safe_get(row, 'cog'),
                "shiptype": safe_get(row, 'shiptype'),
                "length": safe_get(row, 'length'),
                "width": safe_get(row, 'width'),
                "draught": safe_get(row, 'draught'),
                "destination": safe_get(row, 'destination'),
                "eta": safe_get(row, 'eta'),
                "country": meta.get("country"),
                "duration": meta.get("duration"),
                "distance": meta.get("distance")
            }
        }
        features.append(feature)

    geojson = {
        "type": "FeatureCollection",
        "features": features
    }

    GEOJSON_DIR.mkdir(parents=True, exist_ok=True)
    with open(geojson_path, 'w') as f:
        json.dump(geojson, f, indent=2)
    
    print(f"Converted {csv_path.name} to {geojson_path.name} ({len(features)} features)")


def process_all_csvs(input_folder, output_folder):
    input_path = Path(input_folder)
    output_path = Path(output_folder)
    output_path.mkdir(parents=True, exist_ok=True)

    files = sorted(f for f in os.listdir(input_path) if f.endswith(".csv"))
    print(f"Looking in: {input_folder}")
    print("Files:", files)

    for file_name in files:
        print(f"Processing: {file_name}")
        try:
            csv_file = input_path / file_name
            geojson_file = output_path / (file_name.replace(".csv", ".geojson"))
            csv_to_geojson(csv_file, geojson_file)
        except Exception as e:
            print(f"Failed to process {file_name}: {e}")


if __name__ == "__main__":
    input_folder = "../data/raw_csv"
    output_folder = "../data/processed_geojson"
    process_all_csvs(input_folder, output_folder)
