# PsyCheck
This is a NextJS starter for PsyCheck.
A repository documenting the development of PsyCheck App a depression CDSS tool for daily end-user usage and easing the clinical workload.

## Appwrite Setup

This project uses [Appwrite](https://appwrite.io/) for its backend services. To configure Appwrite:

1. Install the Appwrite SDK:

   ```bash
   npm install appwrite
   ```

2. Create a `.env.local` file based on `.env.example` and add your Appwrite credentials:

   ```bash
   NEXT_PUBLIC_APPWRITE_ENDPOINT=YOUR_APPWRITE_ENDPOINT
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=YOUR_APPWRITE_PROJECT_ID
   ```

3. The Appwrite client is initialized in `lib/appwrite.ts`. Import the exported services (e.g. `account`, `databases`, `storage`) wherever you need to interact with Appwrite.

