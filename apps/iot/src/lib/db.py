import asyncpg
import logging
from typing import Optional


class Database:
    def __init__(self, connection_string: str):
        self.connection_string = connection_string
        self.pool: Optional[asyncpg.Pool] = None

    async def connect(self):
        if not self.pool:
            self.pool = await asyncpg.create_pool(self.connection_string)
            logging.info("Database connection pool created.")

    async def disconnect(self):
        if self.pool:
            await self.pool.close()
            self.pool = None
            logging.info("Database connection pool disconnected.")

    async def close(self):
        if self.pool:
            await self.pool.close()
            logging.info("Database connection pool closed.")

    async def get_current_time(self):
        if not self.pool:
            raise RuntimeError("Database not connected.")
        async with self.pool.acquire() as connection:
            return await connection.fetchval("SELECT NOW();")

    async def get_version(self):
        if not self.pool:
            raise RuntimeError("Database not connected.")
        async with self.pool.acquire() as connection:
            return await connection.fetchval("SELECT version();")
