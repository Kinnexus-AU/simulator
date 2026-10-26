FROM bedasoftware/fhirsnake:latest@sha256:e9dd64536b9b31501b0314c5c81caa16de354680b666fb3ce614d93767840f33
RUN apt-get update && apt-get -y upgrade && rm -rf /var/lib/apt/lists/*
ADD seeds ./resources
CMD ["export", "--output", "/data/initBundle.json"]
 
