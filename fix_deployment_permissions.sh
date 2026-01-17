#!/bin/bash

# Configuration
PROJECT_ID="staituned-production-163f4"
PROJECT_NUMBER="1070464718249"

echo "Using Project ID: $PROJECT_ID"
echo "Project Number: $PROJECT_NUMBER"

# 1. Ensure gcloud is pointing to the right project
echo "Setting gcloud project..."
gcloud config set project $PROJECT_ID

# 2. Enable necessary APIs (Idempotent)
echo "Enabling APIs..."
gcloud services enable eventarc.googleapis.com pubsub.googleapis.com run.googleapis.com cloudfunctions.googleapis.com

# 3. Add Pub/Sub Service Agent role
echo "Adding Pub/Sub Service Agent role..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:service-${PROJECT_NUMBER}@gcp-sa-pubsub.iam.gserviceaccount.com" \
    --role='roles/pubsub.serviceAgent'

# 4. Add Eventarc Service Agent role
echo "Adding Eventarc Service Agent role..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:service-${PROJECT_NUMBER}@gcp-sa-eventarc.iam.gserviceaccount.com" \
    --role='roles/eventarc.serviceAgent'

echo "Done! Please verify permissions and try 'firebase deploy' again."
