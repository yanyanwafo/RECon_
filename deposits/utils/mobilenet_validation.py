"""Mock MobileNetV2 material classification for deposit validation."""

from __future__ import annotations

import hashlib
import io
import struct
from dataclasses import dataclass
from typing import BinaryIO

from PIL import Image

MOBILENET_INPUT_SIZE = (224, 224)
PAPER_LABEL = "paper"
CONFIDENCE_THRESHOLD = 0.75


@dataclass(frozen=True)
class ImageStructure:
    format: str
    width: int
    height: int
    mode: str
    byte_length: int


@dataclass(frozen=True)
class MaterialClassificationResult:
    label: str
    confidence: float
    passed: bool
    image_structure: ImageStructure


def validate_material_with_mobilenet(image_data: bytes) -> MaterialClassificationResult:
    """
    Simulate MobileNetV2 inference on an image byte array.

    Pipeline:
    1. Parse and validate image structure
    2. Resize to 224x224 and normalize pixel values (MobileNetV2 preprocessing)
    3. Derive a deterministic mock softmax score for the paper class
    """
    if not image_data:
        raise ValueError("Image data is required for material classification.")

    image_structure = _parse_image_structure(image_data)
    image_array = _preprocess_for_mobilenet(image_data)
    confidence = _mock_paper_confidence(image_array, image_structure)
    passed = confidence >= CONFIDENCE_THRESHOLD

    return MaterialClassificationResult(
        label=PAPER_LABEL,
        confidence=confidence,
        passed=passed,
        image_structure=image_structure,
    )


def _parse_image_structure(image_data: bytes) -> ImageStructure:
    """Inspect image headers and metadata without altering the deposit payload."""
    if image_data[:8] == b"\x89PNG\r\n\x1a\n":
        width, height = _parse_png_dimensions(image_data)
        image_format = "PNG"
    elif image_data[:2] == b"\xff\xd8":
        width, height = _parse_jpeg_dimensions(image_data)
        image_format = "JPEG"
    else:
        raise ValueError("Unsupported or invalid image format. Expected PNG or JPEG.")

    with Image.open(io.BytesIO(image_data)) as image:
        return ImageStructure(
            format=image_format,
            width=width,
            height=height,
            mode=image.mode,
            byte_length=len(image_data),
        )


def _parse_png_dimensions(image_data: bytes) -> tuple[int, int]:
    if len(image_data) < 24:
        raise ValueError("PNG image data is truncated.")
    width, height = struct.unpack(">II", image_data[16:24])
    if width <= 0 or height <= 0:
        raise ValueError("PNG dimensions are invalid.")
    return width, height


def _parse_jpeg_dimensions(image_data: bytes) -> tuple[int, int]:
    stream: BinaryIO = io.BytesIO(image_data)
    if stream.read(2) != b"\xff\xd8":
        raise ValueError("JPEG SOI marker missing.")

    while True:
        marker_prefix = stream.read(1)
        if not marker_prefix:
            raise ValueError("JPEG image data is truncated.")

        if marker_prefix != b"\xff":
            continue

        marker = stream.read(1)
        if not marker:
            raise ValueError("JPEG marker segment is incomplete.")

        if marker in {b"\xc0", b"\xc2"}:
            segment = stream.read(7)
            if len(segment) != 7:
                raise ValueError("JPEG SOF segment is incomplete.")
            height, width = struct.unpack(">HH", segment[1:5])
            if width <= 0 or height <= 0:
                raise ValueError("JPEG dimensions are invalid.")
            return width, height

        if marker == b"\xd9":
            break

        segment_length_bytes = stream.read(2)
        if len(segment_length_bytes) != 2:
            raise ValueError("JPEG segment length is incomplete.")
        segment_length = struct.unpack(">H", segment_length_bytes)[0]
        if segment_length < 2:
            raise ValueError("JPEG segment length is invalid.")
        stream.seek(segment_length - 2, io.SEEK_CUR)

    raise ValueError("JPEG dimensions could not be parsed.")


def _preprocess_for_mobilenet(image_data: bytes) -> list[float]:
    """
    Mirror MobileNetV2 input preparation: RGB resize to 224x224 and scale to [0, 1].
    Returns a flattened normalized pixel vector used by the mock classifier head.
    """
    with Image.open(io.BytesIO(image_data)) as image:
        rgb_image = image.convert("RGB").resize(MOBILENET_INPUT_SIZE, Image.Resampling.BILINEAR)
        pixels = list(rgb_image.getdata())

    normalized = [(red / 255.0, green / 255.0, blue / 255.0) for red, green, blue in pixels]
    return [channel for pixel in normalized for channel in pixel]


def _mock_paper_confidence(
    image_array: list[float],
    image_structure: ImageStructure,
) -> float:
    """
    Produce a deterministic confidence score for the paper label.

    The mock head combines low saturation and high luminance (paper-like cues)
    with a stable hash so repeated submissions remain consistent.
    """
    if not image_array:
        return 0.0

    red_values = image_array[0::3]
    green_values = image_array[1::3]
    blue_values = image_array[2::3]

    luminance = sum((0.299 * r) + (0.587 * g) + (0.114 * b) for r, g, b in zip(red_values, green_values, blue_values))
    luminance /= len(red_values)

    saturation_samples = []
    for red, green, blue in zip(red_values, green_values, blue_values):
        max_channel = max(red, green, blue)
        min_channel = min(red, green, blue)
        if max_channel == 0:
            saturation_samples.append(0.0)
        else:
            saturation_samples.append((max_channel - min_channel) / max_channel)

    average_saturation = sum(saturation_samples) / len(saturation_samples)
    aspect_ratio = image_structure.width / image_structure.height if image_structure.height else 1.0
    aspect_score = 1.0 - min(abs(aspect_ratio - 1.0), 1.0)

    paper_signal = (0.55 * luminance) + (0.30 * (1.0 - average_saturation)) + (0.15 * aspect_score)
    digest = hashlib.sha256(",".join(f"{value:.4f}" for value in image_array[:96]).encode("utf-8")).hexdigest()
    jitter = int(digest[:8], 16) / 0xFFFFFFFF
    confidence = min(max((paper_signal * 0.85) + (jitter * 0.15), 0.0), 1.0)
    return round(confidence, 4)
