#!/bin/zsh

# This script will use Image Magick to combine the images in the katana folder with the corresponding named images in the base folder.
# It will output those combined images into a new folder called 'new'.

# This script assumes that the images in the katana folder are named the same as the images in the base folder, but with a 'k' at the beginning of the name.

for [[i in katana/*]]; do
    convert $i base/${i:7} -composite new/${i:7}
done