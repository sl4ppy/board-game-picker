#!/bin/bash

# Script Name: update.sh
# Description: Template for a bash script on Ubuntu
# Author: Chris
# Date: $(date +"%Y-%m-%d")

# Exit immediately if a command exits with a non-zero status
set -e

# Main script logic
if sudo docker ps --filter "name=bgpicker" --filter "status=running" | grep -q bgpicker; then
    sudo docker stop bgpicker
fi
git pull
sudo docker build . -t bgpicker
sudo docker run -p 3000:3000 -d bgpicker