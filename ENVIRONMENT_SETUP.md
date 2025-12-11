# Environment Setup Instructions

## Required Software

### 1. Node.js (v18 or higher)

**Windows:**
- Download from: https://nodejs.org/
- Run installer and follow prompts
- Verify: `node --version`

**Mac (using Homebrew):**
```bash
brew install node@18
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. PostgreSQL (v12 or higher)

**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Run installer (default port 5432)
- Remember the password you set for 'postgres' user

**Mac (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 3. Git (Optional, for version control)

Download from: https://git-scm.com/downloads

## PostgreSQL Setup

### Create Database User (if needed)

**Windows/Linux:**
```bash
# Login as postgres user
psql -U postgres

# Create user (optional, can use postgres user)
CREATE USER smritipat_user WITH PASSWORD 'your_secure_password';
ALTER USER smritipat_user CREATEDB;

# Exit
\q
```

**Mac:**
```bash
# Usually no password needed on Mac
psql postgres

# Create database
CREATE DATABASE smritipat;

# Exit
\q
```

### Verify PostgreSQL is Running

**Check service status:**

Windows:
- Open Services app
- Look for "postgresql" service
- Ensure it's running

Mac:
```bash
brew services list
```

Linux:
```bash
sudo systemctl status postgresql
```

**Test connection:**
```bash
psql -U postgres -d postgres -c "SELECT version();"
```

## Environment Variables Setup

### 1. Copy Environment Template

The `.env` file should already exist. If not, create it:

```bash
# In project root (smritipat-app/)
touch .env
```

### 2. Edit .env File

Open `.env` in your text editor and update:

```env
# Database Connection
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/smritipat?schema=public"

# NextAuth Configuration
# Generate a random secret: openssl rand -base64 32
NEXTAUTH_SECRET="change-this-to-a-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Generate Secure Secret (Production)

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Mac/Linux:**
```bash
openssl rand -base64 32
```

## Troubleshooting

### Can't Connect to PostgreSQL?

**Issue:** Connection refused
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**
1. Check if PostgreSQL is running
2. Verify port number (default: 5432)
3. Check firewall settings
4. Verify DATABASE_URL in .env

### Wrong Password?

**Issue:** Password authentication failed
```
Error: password authentication failed for user "postgres"
```

**Solutions:**
1. Reset password (Windows/Linux):
   ```bash
   psql -U postgres
   ALTER USER postgres PASSWORD 'new_password';
   ```

2. Update DATABASE_URL in .env with correct password

### Port 3000 Already in Use?

**Issue:** Port is in use
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Use a different port
npm run dev -- -p 3001
```

### Permission Denied (Mac/Linux)?

**Issue:** Permission errors

**Solution:**
```bash
# Fix ownership
sudo chown -R $USER:$USER .

# Fix PostgreSQL permissions
sudo -u postgres psql
GRANT ALL PRIVILEGES ON DATABASE smritipat TO postgres;
```

## Verification Checklist

Before running the application, verify:

- [ ] Node.js installed (`node --version` shows v18+)
- [ ] npm installed (`npm --version`)
- [ ] PostgreSQL installed (`psql --version`)
- [ ] PostgreSQL service is running
- [ ] Can connect to PostgreSQL (`psql -U postgres -d postgres`)
- [ ] Database 'smritipat' created
- [ ] .env file exists with correct credentials
- [ ] All npm packages installed (`npm install` completed)

## Next Steps

Once your environment is set up, proceed with:

1. Database Migration: `npx prisma migrate dev`
2. Seed Database: `npm run db:seed`
3. Start Application: `npm run dev`

See QUICKSTART.md for detailed steps.

## Additional Tools (Optional)

### Prisma Studio
Visual database browser:
```bash
npm run db:studio
```

### VS Code Extensions (Recommended)
- Prisma (prisma.prisma)
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)

## Need Help?

If you encounter issues:
1. Check error message carefully
2. Verify all services are running
3. Check .env configuration
4. Review troubleshooting section above
5. Consult main README.md
