#!/bin/bash
set -e

DOCKER_USER="darkhawk25"

echo "========================================="
echo " Deploying CareerConnect to Docker Hub   "
echo " Account: $DOCKER_USER                   "
echo "========================================="

echo ""
echo "[1/4] Tagging images..."
docker tag devops-2026-cs-f-10-backend:latest $DOCKER_USER/careerconnect-backend:latest
docker tag devops-2026-cs-f-10-backend:latest $DOCKER_USER/careerconnect-backend:v1.0.0
docker tag devops-2026-cs-f-10-frontend:latest $DOCKER_USER/careerconnect-frontend:latest
docker tag devops-2026-cs-f-10-frontend:latest $DOCKER_USER/careerconnect-frontend:v1.0.0

echo ""
echo "[2/4] Logging into Docker Hub..."
docker login -u "$DOCKER_USER"

echo ""
echo "[3/4] Pushing backend images..."
docker push $DOCKER_USER/careerconnect-backend:latest
docker push $DOCKER_USER/careerconnect-backend:v1.0.0

echo ""
echo "[4/4] Pushing frontend images..."
docker push $DOCKER_USER/careerconnect-frontend:latest
docker push $DOCKER_USER/careerconnect-frontend:v1.0.0

echo ""
echo "========================================="
echo " Successfully pushed to Docker Hub!      "
echo "========================================="
echo "Backend repository:  https://hub.docker.com/r/$DOCKER_USER/careerconnect-backend"
echo "Frontend repository: https://hub.docker.com/r/$DOCKER_USER/careerconnect-frontend"
echo ""
echo "Run commands for evaluation:"
echo "  docker run -d -p 5000:5000 $DOCKER_USER/careerconnect-backend:latest"
echo "  docker run -d -p 3000:80 $DOCKER_USER/careerconnect-frontend:latest"
