FROM bedasoftware/fhirsnake:latest@sha256:cc98b6ba1488da4c1c9f0a45e1ee2da8700451d13151a6946a55e0832f3bab35
RUN apt-get update && apt-get -y upgrade && rm -rf /var/lib/apt/lists/*
ADD seeds ./resources
CMD ["export", "--output", "/data/initBundle.json"]
 
