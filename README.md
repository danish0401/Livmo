# Livmo Deployment

## Introduction

This documentation will go through launching and deploying a Livmo Node.js application with a client-server model. This documentation will guide you through the process of setting up the application on an AWS EC2 instance, installing Docker and Docker Compose, cloning the directory, and running the application.

### Application Overview

The Node.js application follows a client-server model, with the client and server components residing in separate directories. The `client` directory contains the client-side code, while the `server` directory contains the server-side code.

### Docker and Docker Compose

We will be leveraging Docker and Docker Compose for containerization and easy deployment of the application. Docker provides a lightweight and isolated environment for running the application, while Docker Compose allows us to define and manage multiple containers as services.

### Prerequisites

Before getting started, ensure that you have the following prerequisites in place:

- An AWS account with appropriate permissions to launch an EC2 instance.
- Basic knowledge of AWS EC2 and familiarity with the AWS Management Console.
- Access to the code repository containing the Node.js application.
- A basic understanding of Docker and Docker Compose.

By the end of this documentation, you will have a fully functional Node.js application running on an AWS EC2 instance using Docker and Docker Compose.

Let's get started with the step-by-step instructions to set up the environment and deploy the application.

**Note:** If you encounter any issues or need further assistance, refer to the Troubleshooting section or consult the provided resources.

Now that we have an overview of the application and the technologies involved, let's proceed with the first step: launching an EC2 instance.

---

## Launching an EC2 Instance
The architecture includes Amazon EC2 for the virtual machine and Amazon VPC for the virtual network.
![Alt text](./readme/architechture.png?raw=true "Architecture")

To set up an instance quickly, follow these steps. You'll select the operating system and your key pair, and accept the default values.

1. Open the Amazon EC2 console at https://console.aws.amazon.com/ec2/.

2. In the navigation bar at the top of the screen, the current AWS Region is displayed (for example, US East (N Viginia)). Select a Region in which to launch the instance. 

3. From the Amazon EC2 console dashboard, choose Launch instance.

4. (Optional) Under Name and tags, for Name, enter a descriptive name for your instance like **Livmo**.

5. Under Application and OS Images (Amazon Machine Image), choose Quick Start, and then choose the **Ubuntu Server 20.04 LTS(HVM)**operating system (OS) for your instance.
![Alt text](./readme/OS.png?raw=true "Operating System")

6. In instance type use t3.xlarge instance (linux pricing 0.1664 $/hr)
![Alt text](./readme/inst_type.png?raw=true "instance Type")


7. Under Key pair (login), for Key pair name, choose an existing key pair or create a new one.(This key pair will be used by you to ssh into isntance)

8. In Network setting, use public subnet and attach security group with port 22,80,3000,8081 open from internet.


*In the Summary panel, choose Launch instance.*

### Connect to your Linux instance using SSH
After you launch your instance, you can connect to it and use it the way that you'd use a computer sitting in front of you.

To connect to your instance using SSH
1. In a terminal window, use the ssh command to connect to the instance. You specify the path and file name of the private key (.pem), the user name for your instance, and the public DNS name or IPv6 address for your instance.

```bash
ssh -i /path/key-pair-name.pem instance-user-name@instance-public-dns-name
```
![Alt text](./readme/ssh.png?raw=true "Optional Title")
---
## Installing Docker and Docker Compose:

### Docker

Docker is an open-source platform that allows you to automate the deployment of applications inside containers. Containers provide a lightweight, isolated environment for running applications with their dependencies.

The Docker installation package available in the official Ubuntu repository may not be the latest version. To ensure we get the latest version, we’ll install Docker from the official Docker repository. To do that, we’ll add a new package source, add the GPG key from Docker to ensure the downloads are valid, and then install the package.

First, update your existing list of packages:

```bash
sudo apt update
```
Next, install a few prerequisite packages which let apt use packages over HTTPS:
```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common
```
Then add the GPG key for the official Docker repository to your system:
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```
Add the Docker repository to APT sources:
```bash
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
```
This will also update our package database with the Docker packages from the newly added repo.

Make sure you are about to install from the Docker repo instead of the default Ubuntu repo:
```bash
apt-cache policy docker-ce
```
Finally, install Docker:
```bash
sudo apt install docker-ce
```
Docker should now be installed, the daemon started, and the process enabled to start on boot. Check that it’s running:
```bash
sudo systemctl status docker
```
![Alt text](./readme/docker.png?raw=true "sudo systemctl status docker")
Installing Docker now gives you not just the Docker service (daemon) but also the docker command line utility, or the Docker client.

Now add your username to the docker group:
```bash
sudo usermod -aG docker ${USER}
```

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

The following command will download the 1.29.2 release and save the executable file at /usr/local/bin/docker-compose, which will make this software globally accessible as docker-compose:

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```
Next, set the correct permissions so that the docker-compose command is executable:

```bash
sudo chmod +x /usr/local/bin/docker-compose
```
To verify that the installation was successful, you can run:
```bash
docker-compose --version
```
![Alt text](./readme/docker_compose.png?raw=true "docker-compose version")

To use Docker Compose:

1.  We have a file named `docker-compose.yaml` in the root directory of our project.
    
2.  In the `docker-compose.yaml` file, defined the services for our client and server containers. Here's an example:

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

---

## Cloning the repository
lone the code repository containing your Node.js app.
```bash
git clone <repository_url>
```
![Alt text](./readme/git_clone.png?raw=true "Cloning the repository")

Replace `<repository_url>` with the URL of your Git repository.

#### Project structure:

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
## Installing the Node.js App
To get node.js, we used the apt package manager. Refresh your local package index first:
```bash
sudo apt update
```
Then install Node.js:
```bash
sudo apt install nodejs
```
Check that the install was successful by querying node for its version number:
```bash
node -v
```
![Alt text](./readme/node_version.png?raw=true "node -v")

---

## Running the Application
With the docker-compose.yml file in place, we can now execute Docker Compose to bring our environment up. The following command will download the necessary Docker images, create a container for the web service, and run the containerized environment in background mode:
```bash
docker-compose up -d
```
![Alt text](./readme/compose_up.png?raw=true "docker-compose up -d")


This command will build the Docker images and start the containers in the background (`-d` flag).
After running the command, your Node.js application will be up and running on your AWS EC2 instance.
