"""Rebuild the Khayaal logo assets from the original raster at ultra-high resolution.

The original artwork is a flat ink colour composited onto transparency, so its
alpha channel is a coverage field and the true geometric outline sits on the
0.5 iso-line. This package recovers that outline as sub-pixel polygons and
re-rasterises it at any size, which sharpens every edge without redrawing a
single letterform.
"""
