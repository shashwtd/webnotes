# MyNotes

Host your notes online with MyNotes, a simple and efficient way to sync your local notes and deploy them to the web.

## Features

- Sync local notes to the cloud
- Easy-to-use web interface for viewing notes
- Simple deployment
- Responsive design for mobile and desktop
- Secure note storage

## Live Demo

You may navigate to the [live demo](https://mynotes.ink) to see MyNotes in action.

## Local Development

### Prerequisites

- Node.js
- npm

### Setup

1. Clone the repository:

```bash
git clone https://github.com/shashwtd/webnotes.git
cd webnotes
```

### Start the backend server:

Setup the following environment variables. You must export them in your terminal.

```env
SUPABASE_URL=[Your Supabase URL]
SUPABASE_SR_KEY=[Your Supabase Service Role Key]
SUPABASE_ANON_KEY=[Your Supabase Anon Key]
JWT_SIGNING_KEY=[Your JWT Signing Key]
DEBUG=false
```

From the root directory of the project, run the following commands to set up and start the backend:

```bash
cd backend
go mod tidy
go run .
```

### Start the frontend server:

Setup the following environment variables. Place them in a `.env` file in the `frontend` directory:

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:8080
NEXT_PUBLIC_DOMAIN=localhost:3000
```

From the root directory of the project, run the following commands to set up and start the frontend:

```bash
cd frontend
npm install
npm run dev
```

### Access the application

Open your web browser and navigate to `http://localhost:3000` to access the MyNotes application.

Here, you may also download the [MacOS Client](http://localhost:3000/dashboard/client).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please contact us on our [email](mailto:webnotes916@gmail.com).
