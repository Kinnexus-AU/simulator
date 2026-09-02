FROM bedasoftware/fhirsnake:latest@sha256:a9532fc10ccc7adcffe4b0e1a9f0685038c02f7d8584d605622b94e626419483
RUN apt-get update && apt-get -y upgrade && rm -rf /var/lib/apt/lists/*
ADD seeds ./resources
CMD ["export", "--output", "/data/initBundle.json"]
 
