import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const defaultPages = [
  { slug: 'homepage', title: 'Homepage', description: 'Main landing page with hero section and featured content' },
  { slug: 'search', title: 'Search', description: 'Search interface with real-time content filtering' },
  { slug: 'articles', title: 'Articles', description: 'Articles listing page with category browsing' },
  { slug: 'about', title: 'About Us', description: 'Company story, mission, values, and team' },
  { slug: 'contact', title: 'Contact Us', description: 'Contact form and office information' },
  { slug: 'privacy', title: 'Privacy Policy', description: 'Data collection, usage, and protection policy' },
  { slug: 'terms', title: 'Terms of Use', description: 'Service terms, user responsibilities, and legal information' },
]

const defaultArticles = [
  {
    slug: 'getting-started-with-termux',
    title: 'Getting Started with Termux: Your First Commands',
    excerpt: 'A practical walkthrough of installing Termux on Android, running your first shell commands, and setting up the basics you need to get productive fast.',
    tags: ['termux', 'beginners', 'android', 'setup'],
    keywords: ['termux install', 'termux setup', 'termux beginner', 'android terminal', 'first termux commands'],
    body: `## What is Termux?

Termux is a free and open-source terminal emulator and Linux environment app for Android. It does not require a rooted or special setup. The app provides a base system while the additional packages are available via the apt package manager.

## Installing Termux

Download Termux from the F-Droid repository rather than Google Play, as the Play Store version is no longer maintained and may have known vulnerabilities.

1. Visit https://f-droid.org and search for Termux.
2. Install the F-Droid app store on your device.
3. Download and install Termux from F-Droid.
4. Open Termux. You will land in a bash shell immediately.

## Your First Commands

Once Termux is open, try these commands to orient yourself:

\`\`\`bash
# Show your current working directory
pwd

# List files in the current directory
ls -la

# Check your Android device info
uname -a

# Update package index and upgrade installed packages
apt update && apt upgrade
\`\`\`

## Setting Up Storage Access

By default, Termux operates in its own sandboxed directory. To access files on your device's storage, run the setup-storage script:

\`\`\`bash
termux-setup-storage
\`\`\`

This creates a \`storage\` symlink in your home directory that points to your device's shared storage. You can now navigate to your files:

\`\`\`bash
cd ~/storage/shared
ls
\`\`\`

## Installing Essential Tools

A few packages you will reach for constantly:

\`\`\`bash
apt install -y curl wget git nano vim python3 nodejs
\`\`\`

- **curl / wget** — download files and interact with APIs from the command line.
- **git** — version control. Essential if you plan to clone repositories.
- **nano / vim** — terminal text editors.
- **python3 / nodejs** — scripting and runtime environments.

## Summary

You now have Termux installed, storage access configured, and the foundational packages in place. The next steps depend on your goals: setting up a web server, running a database, or automating tasks with scripts. Each of those topics is covered in its own guide on this platform.`,
  },
  {
    slug: 'termux-packages-and-package-managers',
    title: 'Understanding Termux Packages and Package Managers',
    excerpt: 'Learn how Termux handles software installation through apt, which repositories are available, and how to manage package versions and dependencies.',
    tags: ['termux', 'packages', 'apt', 'package management'],
    keywords: ['termux packages', 'termux apt', 'termux repository', 'install packages termux', 'package manager android'],
    body: `## How Package Management Works in Termux

Termux uses the Debian-style \`apt\` package manager. Packages are downloaded from Termux's own repositories, compiled for the ARM architecture of your phone. This means the binaries are not the same as those in a standard Linux distribution — they are recompiled specifically for Termux's prefix directory.

## The Termux Prefix

Everything in Termux is installed under a single prefix directory:

\`\`\`
/data/data/com.termux.app/files/usr
\`\`\`

This is where binaries, libraries, headers, and configuration files live. Understanding this path matters when you troubleshoot missing shared libraries or broken symlinks.

## Core apt Commands

\`\`\`bash
# Update package index (do this regularly)
apt update

# Upgrade all installed packages
apt upgrade

# Search for a package by name
apt search <package-name>

# Install a package
apt install <package-name>

# Remove a package (keep config files)
apt remove <package-name>

# Fully purge a package and its config
apt purge <package-name>

# List installed packages
dpkg -l

# Show info about a specific package
apt show <package-name>
\`\`\`

## Available Repositories

Termux ships with its main repository pre-configured. Community-maintained repositories can be added for additional software:

- **Main repo** — core system tools, compilers, interpreters.
- **Science repo** — scientific computing libraries.
- **Community repo** — miscellaneous tools contributed by the community.
- **Root repo** — packages that require root access (only useful on rooted devices).

You can manage repositories with:

\`\`\`bash
termux-change-repo
\`\`\`

This opens an interactive menu to switch mirrors and add extra repositories.

## Pinning and Holding Packages

If a package upgrade breaks something, you can hold it at the current version:

\`\`\`bash
apt hold <package-name>
\`\`\`

To release it later:

\`\`\`bash
apt unhold <package-name>
\`\`\`

## Compiling from Source

Some packages are not available in any repository. Termux provides build tools so you can compile software yourself:

\`\`\`bash
apt install -y build-essential pkg-config
\`\`\`

With \`gcc\`, \`make\`, and the development headers for common libraries installed, you can follow upstream build instructions with minor path adjustments for the Termux prefix.

## Best Practices

1. Always run \`apt update\` before installing new packages.
2. Avoid mixing packages from different repositories when possible.
3. Back up your home directory periodically — \`apt purge\` or an app update can occasionally clear it.
4. Use \`apt hold\` before upgrades if you are running a production service inside Termux.`,
  },
  {
    slug: 'setting-up-development-environment',
    title: 'Setting Up a Development Environment in Termux',
    excerpt: 'Configure a full development stack on your phone: Node.js, Python, Git, and an IDE-like editing experience — all inside Termux.',
    tags: ['termux', 'development', 'nodejs', 'python', 'git'],
    keywords: ['termux development', 'termux nodejs', 'termux python', 'coding on android', 'dev environment mobile'],
    body: `## Why Develop in Termux?

If you are traveling, away from your desktop, or simply prefer working from your phone, Termux gives you a surprisingly capable development environment. The key is setting it up correctly from the start.

## Install Core Tools

\`\`\`bash
apt update && apt upgrade
apt install -y git nodejs npm python3 pip ruby cargo
\`\`\`

### Node.js and npm

Node.js in Termux supports most JavaScript projects. After installation, verify:

\`\`\`bash
node --version
npm --version
\`\`\`

Install global packages with:

\`\`\`bash
npm install -g <package>
\`\`\`

### Python 3

Python 3 comes with pip. Install virtual environments for project isolation:

\`\`\`bash
pip install virtualenv
mkdir ~/projects/my-project && cd ~/projects/my-project
python3 -m venv venv
source venv/bin/activate
pip install flask django requests
\`\`\`

## Configuring Git

Set up your identity so commits are attributed correctly:

\`\`\`bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
\`\`\`

### SSH Keys for GitHub

Generate an SSH key and add it to your GitHub account:

\`\`\`bash
ssh-keygen -t ed25519 -C "you@example.com"
cat ~/.ssh/id_ed25519.pub
\`\`\`

Copy the public key output and paste it into GitHub under Settings > SSH Keys.

## Text Editing

### Vim

Vim is powerful but has a steep learning curve. Install a sensible config:

\`\`\`bash
apt install -y vim
\`\`\`

Create a minimal \`~/.vimrc\`:

\`\`\`
set number
set expandtab
set tabstop=2
set shiftwidth=2
syntax on
colorscheme desert
\`\`\`

### Nano

For quick edits, nano is simpler:

\`\`\`bash
nano filename.txt
\`\`\`

## Project Structure Best Practice

Keep all your projects organized:

\`\`\`bash
mkdir -p ~/projects
cd ~/projects
git clone git@github.com:your-username/your-repo.git
cd your-repo
\`\`\`

## Running a Local Dev Server

Once you have a Node.js project:

\`\`\`bash
cd ~/projects/my-web-app
npm install
npm run dev
\`\`\`

The server typically starts on \`localhost:3000\`. You can access it from a browser on the same device.

## Tips

- Use \`tmux\` to run multiple terminal sessions in one window.
- Use \`screen\` if tmux is unavailable.
- Keep your packages up to date weekly to avoid dependency conflicts.`,
  },
  {
    slug: 'running-a-web-server-in-termux',
    title: 'How to Run a Web Server on Termux',
    excerpt: 'Deploy and serve a website directly from your Android phone using nginx or a Node.js HTTP server inside Termux.',
    tags: ['termux', 'web server', 'nginx', 'nodejs', 'hosting'],
    keywords: ['termux web server', 'termux nginx', 'host website termux', 'termux localhost', 'android web server'],
    body: `## Overview

Running a web server inside Termux lets you host and test websites locally — or even expose them to the internet using a reverse tunnel. This guide covers two approaches: a lightweight Node.js server and nginx for production-style serving.

## Option 1: Node.js HTTP Server

The fastest way to serve static files:

\`\`\`bash
apt install -y nodejs npm
mkdir -p ~/www
echo '<h1>Hello from Termux</h1>' > ~/www/index.html
cd ~/www
npx serve .
\`\`\`

Open \`http://localhost:3000\` in your browser. Done.

### Serving a Next.js or Express App

\`\`\`bash
cd ~/projects/my-app
npm install
npm start
\`\`\`

Most frameworks default to port 3000. You can change it via environment variables.

## Option 2: Nginx

Nginx is a production-grade HTTP server with excellent performance:

\`\`\`bash
apt install -y nginx
\`\`\`

### Configuration

Edit the default server block:

\`\`\`bash
nano $PREFIX/etc/nginx/nginx.conf
\`\`\`

Replace the content with:

\`\`\`nginx
events {}
http {
    include       mime.types;
    default_type  application/octet-stream;

    server {
        listen       8080;
        server_name  localhost;
        root         /data/user/0/com.termux.app/files/home/www;
        index        index.html;

        location / {
            try_files $uri $uri/ =404;
        }
    }
}
\`\`\`

### Start nginx

\`\`\`bash
nginx
\`\`\`

Access your site at \`http://localhost:8080\`.

### Stop or Reload

\`\`\`bash
nginx -s stop
nginx -s reload
\`\`\`

## Exposing to the Internet

To make your Termux web server accessible from outside your local network, use a reverse tunnel:

\`\`\`bash
apt install -y cloudflared
cloudflared tunnel --url http://localhost:8080
\`\`\`

Cloudflare will print a public URL that forwards traffic to your local server. No port forwarding or firewall changes needed.

## Security Note

Never expose a development server directly to the public internet without authentication. Use Cloudflare Access or a VPN to restrict who can reach your tunnel.`,
  },
  {
    slug: 'termux-ssh-remote-access',
    title: 'Termux SSH: Remote Access from Your Phone',
    excerpt: 'Set up an SSH server in Termux so you can connect to your phone remotely from a laptop, or SSH out to remote machines.',
    tags: ['termux', 'ssh', 'remote', 'security', 'sshd'],
    keywords: ['termux ssh server', 'ssh into android', 'termux remote access', 'sshd termux', 'connect to termux remotely'],
    body: `## SSH in Both Directions

Termux supports SSH in two ways:

1. **SSH server (sshd)** — other devices connect *into* your phone.
2. **SSH client** — your phone connects *out* to remote servers.

Both use the OpenSSH package.

## Setting Up the SSH Server

### Install OpenSSH

\`\`\`bash
apt install -y openssh
\`\`\`

### Generate Host Keys

\`\`\`bash
ssh-keygen -t rsa -b 4096 -f $PREFIX/etc/ssh/ssh_host_rsa_key -N ""
ssh-keygen -t ed25519 -f $PREFIX/etc/ssh/ssh_host_ed25519_key -N ""
\`\`\`

### Configure sshd

Edit \`$PREFIX/etc/ssh/sshd_config\`:

\`\`\`
Port 2222
HostKey /data/data/com.termux.app/files/usr/etc/ssh/ssh_host_rsa_key
HostKey /data/data/com.termux.app/files/usr/etc/ssh/ssh_host_ed25519_key
PermitRootLogin yes
PubkeyAuthentication yes
PasswordAuthentication no
\`\`\`

Note: Termux uses port 2222 by default because binding to port 22 requires root privileges.

### Set Up Authorized Keys

On your laptop, copy your public SSH key:

\`\`\`bash
# On your laptop:
cat ~/.ssh/id_ed25519.pub
\`\`\`

Then on your phone, paste it into the authorized keys file:

\`\`\`bash
# In Termux:
mkdir -p ~/.ssh
echo "ssh-ed25519 AAAA..." >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
\`\`\`

### Start sshd

\`\`\`bash
sshd
\`\`\`

### Connect from Your Laptop

\`\`\`bash
ssh -p 2222 termux@<phone-ip-address>
\`\`\`

Find your phone's IP with:

\`\`\`bash
# In Termux:
ifconfig
\`\`\`

Or look in your phone's Wi-Fi settings.

## Using SSH as a Client

Connecting to remote Linux servers from Termux works exactly like on a desktop:

\`\`\`bash
ssh user@remote-server.com
ssh -p 2222 -i ~/.ssh/id_ed25519 user@192.168.1.100
\`\`\`

## Auto-Starting sshd

Create a simple script to start the SSH server automatically when Termux opens:

Add this to your \`~/.bashrc\`:

\`\`\`bash
sshd 2>/dev/null || true
\`\`\`

## Tips

- Always disable password authentication when SSH is exposed.
- On a shared Wi-Fi network, use a VPN before running sshd.
- Use \`tmux\` or \`screen\` on the remote end so your session survives disconnects.`,
  },
  {
    slug: 'database-management-with-sqlite',
    title: 'Database Management with SQLite in Termux',
    excerpt: 'Work with SQLite databases directly in Termux — create tables, run queries, backup data, and integrate with Python or Node.js scripts.',
    tags: ['termux', 'database', 'sqlite', 'sql', 'data'],
    keywords: ['termux sqlite', 'sqlite on android', 'database termux', 'sql queries termux', 'sqlite3 cli'],
    body: `## Why SQLite?

SQLite is a file-based database engine. There is no server to start, no configuration to manage. The entire database is a single file on disk, which makes it perfect for Termux — lightweight, portable, and zero-overhead.

## Installation

\`\`\`bash
apt install -y sqlite
\`\`\`

Verify:

\`\`\`bash
sqlite3 --version
\`\`\`

## Creating a Database

\`\`\`bash
sqlite3 ~/mydata.db
\`\`\`

This opens an interactive prompt (or creates the file if it does not exist).

## Core SQL Commands

### Create a Table

\`\`\`sql
CREATE TABLE users (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT    NOT NULL,
    email     TEXT    UNIQUE NOT NULL,
    created   DATETIME DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Insert Data

\`\`\`sql
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
INSERT INTO users (name, email) VALUES ('Bob', 'bob@example.com');
\`\`\`

### Query Data

\`\`\`sql
SELECT * FROM users;
SELECT name FROM users WHERE email LIKE '%example%';
SELECT COUNT(*) FROM users;
\`\`\`

### Update and Delete

\`\`\`sql
UPDATE users SET name = 'Alice Smith' WHERE id = 1;
DELETE FROM users WHERE id = 2;
\`\`\`

## Indexing for Performance

If your database grows beyond a few thousand rows, add indexes on columns you query frequently:

\`\`\`sql
CREATE INDEX idx_users_email ON users (email);
\`\`\`

## Backing Up

\`\`\`bash
# Copy the file directly (works if no writes are happening)
cp ~/mydata.db ~/mydata_backup_$(date +%Y%m%d).db

# Or use SQLite's built-in backup command
sqlite3 ~/mydata.db ".backup ~/mydata_backup.db"
\`\`\`

## Using SQLite with Python

\`\`\`python
import sqlite3

conn = sqlite3.connect('/home/user/mydata.db')
cursor = conn.cursor()

cursor.execute('SELECT * FROM users')
for row in cursor.fetchall():
    print(row)

conn.close()
\`\`\`

## Using SQLite with Node.js

\`\`\`bash
npm install better-sqlite3
\`\`\`

\`\`\`javascript
const Database = require('better-sqlite3');
const db = new Database('/home/user/mydata.db');

const rows = db.prepare('SELECT * FROM users').all();
console.log(rows);

db.close();
\`\`\`

## Tips

- Use \`.tables\` and \`.schema\` in the sqlite3 CLI to inspect your database structure.
- Use \`.mode column\` and \`.headers on\` for readable output in the terminal.
- SQLite handles concurrent reads well but is not designed for heavy concurrent writes — keep that in mind if multiple scripts hit the same database.`,
  },
  {
    slug: 'automating-tasks-with-cron-in-termux',
    title: 'Automating Tasks with Cron Jobs in Termux',
    excerpt: 'Schedule recurring tasks — backups, API calls, log cleanup — using crontab inside Termux without needing root access.',
    tags: ['termux', 'cron', 'automation', 'scheduling', 'scripts'],
    keywords: ['termux cron', 'crontab termux', 'schedule task termux', 'automation android', 'termux cron job'],
    body: `## What is Cron?

Cron is a job scheduler built into Unix-like systems. It reads a configuration file called \`crontab\` and executes commands at the times you specify. Termux includes cron out of the box.

## Starting the Cron Daemon

Cron does not start automatically in Termux. You must start it manually each time Termux launches:

\`\`\`bash
crond
\`\`\`

To make sure it starts every time you open Termux, add this to \`~/.bashrc\`:

\`\`\`bash
crond 2>/dev/null || true
\`\`\`

## Editing Your Crontab

\`\`\`bash
crontab -e
\`\`\`

This opens your crontab file in your default editor. The format for each line is:

\`\`\`
┌───────────── minute        (0 - 59)
│ ┌───────────── hour         (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month       (1 - 12)
│ │ │ │ ┌───────────── day of week (0 = Sunday)
│ │ │ │ │
* * * * * command-to-execute
\`\`\`

## Example Jobs

### Run a script every 5 minutes

\`\`\`
*/5 * * * * /home/user/scripts/health-check.sh
\`\`\`

### Daily backup at 2:00 AM

\`\`\`
0 2 * * * cp ~/mydata.db ~/backups/mydata_$(date +%Y%m%d).db
\`\`\`

### Fetch data from an API every hour

\`\`\`
0 * * * * curl -s https://api.example.com/data >> ~/logs/api-responses.log
\`\`\`

### Clean up old log files weekly (Sunday at midnight)

\`\`\`
0 0 0 * 0 find ~/logs -name "*.log" -mtime +7 -delete
\`\`\`

## Writing Reliable Cron Scripts

Cron jobs run with a minimal PATH. Always use absolute paths in your scripts:

\`\`\`bash
#!/bin/bash
export PATH=$PREFIX/bin:/usr/bin:/bin

# Your commands here
echo "Job ran at $(date)" >> /home/user/logs/cron.log
\`\`\`

Make scripts executable:

\`\`\`bash
chmod +x ~/scripts/my-job.sh
\`\`\`

## Viewing Your Crontab

\`\`\`bash
crontab -l
\`\`\`

## Removing All Cron Jobs

\`\`\`bash
crontab -r
\`\`\`

## Important Limitation

Termux must be running (or at least in the background) for cron jobs to execute. If the Android system kills Termux, cron stops. To keep Termux alive, consider running a long-lived process like \`sshd\` or a background server in addition to cron.

## Tips

- Always redirect output to a log file so you can debug jobs that fail silently.
- Test your cron expressions with an online cron expression editor before deploying.
- Use \`at\` for one-time scheduled tasks: \`at 3:00\` and then type your command.`,
  },
  {
    slug: 'securing-your-termux-environment',
    title: 'Securing Your Termux Environment',
    excerpt: 'Harden your Termux installation against common threats: lock down SSH, manage permissions correctly, and avoid exposing services unnecessarily.',
    tags: ['termux', 'security', 'hardening', 'ssh', 'permissions'],
    keywords: ['termux security', 'secure termux', 'termux hardening', 'android security termux', 'termux best practices'],
    body: `## Why Security Matters on Termux

Termux is a full Linux environment on a device that is often connected to public Wi-Fi, synced with cloud services, and shared among household members. If you run servers, store credentials, or handle any sensitive data, basic security hygiene is not optional.

## 1. Disable Password Authentication on SSH

If you are running sshd, the single most important step is disabling password-based login:

\`\`\`bash
nano $PREFIX/etc/ssh/sshd_config
\`\`\`

Set:

\`\`\`
PasswordAuthentication no
PubkeyAuthentication yes
\`\`\`

Restart sshd:

\`\`\`bash
pkill sshd && sshd
\`\`\`

## 2. Protect Your Private Keys

SSH keys and API tokens are the most sensitive files in your home directory. Lock down permissions:

\`\`\`bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 600 ~/.ssh/authorized_keys
\`\`\`

Never share or paste your private key anywhere.

## 3. Use Environment Variables for Secrets

Do not hardcode API keys, passwords, or tokens in your scripts. Use environment variables instead:

\`\`\`bash
# In ~/.bashrc or a .env file
export API_KEY="your-key-here"
export DB_PASSWORD="your-password-here"
\`\`\`

In your scripts:

\`\`\`bash
curl -H "Authorization: Bearer $API_KEY" https://api.example.com/data
\`\`\`

## 4. Keep Software Up to Date

Outdated packages are the most common attack vector. Run updates regularly:

\`\`\`bash
apt update && apt upgrade
\`\`\`

## 5. Do Not Run Services You Do Not Need

Every running service is a potential entry point. If you are not using nginx, stop it. If you do not need sshd today, do not start it:

\`\`\`bash
# Stop nginx
nginx -s stop

# Stop sshd
pkill sshd
\`\`\`

## 6. Use a Firewall for Exposed Services

If you expose Termux services to the internet via a tunnel, put them behind authentication. Cloudflare Access, for example, lets you require a login before anyone reaches your server.

## 7. Audit Running Processes

Regularly check what is running:

\`\`\`bash
ps aux
\`\`\`

If you see something you did not start, investigate before ignoring it.

## 8. Back Up Regularly

Security is useless if you lose everything. Automate backups:

\`\`\`bash
# In crontab:
0 3 * * * tar -czf ~/backups/home_$(date +%Y%m%d).tar.gz ~/projects ~/scripts ~/.ssh/authorized_keys
\`\`\`

## 9. Be Careful on Public Wi-Fi

On untrusted networks:
- Do not run sshd unless you need to.
- Use a VPN if you are connecting to remote servers.
- Avoid entering passwords in browser forms over unencrypted connections.

## Summary

Security in Termux follows the same principles as any Linux system: minimize attack surface, protect secrets, keep software current, and monitor what is running. A few minutes of setup prevents hours of incident response.`,
  },
]

async function main() {
  // ── pages ──────────────────────────────────────────────
  for (const page of defaultPages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    })
  }

  // ── articles ───────────────────────────────────────────
  for (const article of defaultArticles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        title:    article.title,
        excerpt:  article.excerpt,
        body:     article.body,
        tags:     article.tags,
        keywords: article.keywords,
      },
      create: {
        ...article,
        status: 'published',
      },
    })
  }

  console.log(`Seed complete: 7 pages + ${defaultArticles.length} articles created.`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
