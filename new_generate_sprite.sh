# /bin/sh

# Generate normal sprites:
spreet -r 2 icons/ sprite-sheets/sprite

# Generate retina sprites:
spreet -r 4 icons/ sprite-sheets/sprite@2x

# Print some useful info:
echo "Generated sprite sheets successfully"
