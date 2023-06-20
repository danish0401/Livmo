# Livmo Deployment
### Project structure:

- server: contains configuration files of server(backEnd)
- client: contains configuration files of client(frontEnd)
- docker-compose.yaml: contains configurations to manage multi-container Docker deployment
- Jenkinsfile: contains jenkins pipeline code for automatic deployent

```
 Livmo/
   ├── client/
   ├── server/
   ├── README.md
   ├── docker-compose.yml
   └── Jenkinsfile         # contains jenkins pipeline code for automatic deployent
```

## PreRequisites
Before you begin this tutorial, ensure the following is installed in EC2 instance:
-   Node.js (available  [here](https://nodejs.org/)  or via  [nvm](https://github.com/creationix/nvm))
-   [Docker](https://www.docker.com/get-started)
-  Docker-compose

### Docker
Docker is an open-source platform that allows you to automate the deployment of applications inside containers. Containers provide a lightweight, isolated environment for running applications with their dependencies.
To get started with Docker:

1. Install Docker on your local machine by following the instructions for your operating system. You can find the installation files and detailed guides on the [Docker website](https://www.docker.com/get-started).

2. Once Docker is installed, you can use the Docker CLI (Command Line Interface) to manage containers, build images, and more. Docker uses a Dockerfile, which is a text file that contains instructions to build a Docker image.

#### Dockerfile

In our scenario, we have a Node.js application with client and server directories. To containerize the application, we will create two Dockerfiles - one for the client and one for the server. 
Here's an example of a Dockerfile for the server:

```dockerfile
FROM  node:18-alpine

WORKDIR  /usr/src/server

COPY  package.json  .
COPY  package-lock.json  .
RUN  npm  install

COPY  .  .  

CMD  ["node",  "server.js"]
```

You can create a similar Dockerfile for the client directory, customizing it according to your requirements.
### Docker Compose

Docker Compose is a tool that allows you to define and manage multi-container Docker applications. It uses a YAML file (docker-compose.yaml) to configure the services, networks, and volumes required for your application.

To use Docker Compose:

1.  Create a file named `docker-compose.yaml` in the root directory of your project.
    
2.  In the `docker-compose.yaml` file, define the services for your client and server containers. Here's an example:

```yml
version: '3.8'
services:
  server:
    build: ./server
    restart: unless-stopped
    container_name: api_backend
    ports:
      - '3000:3000'
    networks:
      - shared-network
  client:
    stdin_open: true
    build: ./client
    container_name: app_frontend
    ports:
      - '80:3000'
    networks:
      - shared-network
    depends_on:
      - server
networks:
  shared-network:

```

## Deployment on AWS EC2

The architecture includes Amazon EC2 for the virtual machine and Amazon VPC for the virtual network. To give you a working project out of the box that you can customize easily and extend to suit your needs.
1.  Set up an EC2 instance on AWS by following the appropriate [documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-instance-wizard.html). 
2.  Connect to your EC2 instance using SSH.
```bash
ssh -i "ssh_key.pem" ubuntu@public_ip
```
![Alt text](./readme/ssh.png?raw=true "Optional Title")

3.  Ensure that the instance has all prerequisites installed.
```bash
docker version
docker info
docker-compose version
```
![Alt text](./readme/docker_version.png?raw=true "Optional Title")
![Alt text](./readme/docker_compose.png?raw=true "Optional Title")

if prerequisites are not installed you can follow these documentations to install [Docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04) and [Docker-compose](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04).

4.  Clone the code repository.
```bash
git clone <repository_url>
```
![Alt text](./readme/git_clone.png?raw=true "Optional Title")

Replace `<repository_url>` with the URL of your Git repository.

5.  After cloning git repo, navigate to the project directory.
```bash
cd ./Livmo
```    
6.  Build and start the Docker containers using Docker Compose with the following command:
```bash
docker-compose up -d
```
![Alt text](./readme/compose_up.png?raw=true "Optional Title")


This command will build the Docker images and start the containers in the background (`-d` flag).
After running the command, your Node.js application will be up and running on your AWS EC2 instance.
