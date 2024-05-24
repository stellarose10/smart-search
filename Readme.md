# Smart Search Algorithm

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/smart-search.git
   cd smart-search
2. Install dependencies:
   npm install
3. Setup PostgreSQL database and update the connection string in prisma/.env.
   ## Add in .env file:
    DATABASE_URL="postgresql://username:password@localhost:5432/smart_search_db" 
4. Run Prisma migrations:
    npx prisma migrate dev
5. Seed the database:
   ts-node prisma/seed.ts
6. Start the server:
   npm run dev
7. To search for entities, send a GET request to
     ` http://localhost:3001/search?q=<searchTerm>`



## Example:
    `http://localhost:3001/search?q="McDonalds in London or Manchester"`
      
![Example](image.png)# smart-search
