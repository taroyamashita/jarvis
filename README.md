# jarvis
Chatbot integrated with gpt-2

The chatbot uses the gpt-2 with huggingface's javascript inference library to perform sentence similarity on a prepopulated list of faqs. 
Sentence similarity is done using embedding comparison using the gpt-2 model. 

Installation instructions
```
cd into the client directory
npm i
in src/config/config.ts replace the API_KEY with a valid hugging face inference API Key
npm run start
navigate to http://localhost:3000/
```

# Containerization and Deployment

To properly containerize the application several steps would be needed.
1. Setting up a server, that can be used to interact with the model instead of using the inference API.
2. The server would have its own docker image and can be hosted on a platform like AWS using EC2 and Elastic Beanstalk for autoscaling
    container orchestration can be done with AWS EKS (Kubernetes equivalent).
3. Given the nature of FAQ data, there is very likely high repetition of requests and as such the value of caching on  the server side
    is high so a Redis cache can be put in front of the server to limit calls, improve performance and reduce hosting costs.
4. Storing the faqs with the embeddings, in a postgres database, postgres has features that accomodate the storing of embedding specifically
    making this a preferrable choice for ease-of-use, robustnes, cost and performance. 
5. Like the server the Database can be hosted on AWS using a service like RDS.  
6. The React App is lightweight and can be  hosted on a cost-effective service like AWS S3 with Cloudfront

