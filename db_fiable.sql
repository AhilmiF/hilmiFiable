/*
  SQLite schema generated from backend/prisma/schema.prisma
  Tables: User, Konsultasi, Artikel, Gallery, Position, TeamMember, ContactInfo
*/

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'ADMIN',
  "createdAt" DATETIME NOT NULL DEFAULT (datetime('now')),
  "updatedAt" DATETIME NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE "Konsultasi" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "kronologi" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" DATETIME NOT NULL DEFAULT (datetime('now')),
  "updatedAt" DATETIME NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE "Artikel" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "judul" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "keterangan" TEXT NOT NULL,
  "kategori" TEXT,
  "konten" TEXT,
  "photoUrl" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT (datetime('now')),
  "updatedAt" DATETIME NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE "Gallery" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "photoUrl" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE "Position" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL UNIQUE,
  "slug" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE "TeamMember" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "role" TEXT,
  "specialty" TEXT,
  "bio" TEXT,
  "bioDua" TEXT,
  "photoUrl" TEXT,
  "instagramUrl" TEXT,
  "linkedinUrl" TEXT,
  "portfolioUrl" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT (datetime('now')),
  "updatedAt" DATETIME NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE "ContactInfo" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "address" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "mapEmbedUrl" TEXT,
  "updatedAt" DATETIME NOT NULL DEFAULT (datetime('now'))
);
