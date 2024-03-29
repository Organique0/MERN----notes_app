import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Note } from "../models/note";
import { User } from "../models/user";

async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch("https://mern-notes-app.azurewebsites.net" + input, init); //for localhost change this input url and add a proxy back
  if (response.ok) {
    return response;
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.error;
    if (response.status === 401) {
      throw new UnauthorizedError(errorMessage);
    } else if (response.status === 409) {
      throw new ConflictError(errorMessage);
    } else {
      throw Error(
        "Request failed with status code " +
        response.status +
        "message: " +
        errorMessage
      );
    }
  }
}

export async function getLoggedInUser(): Promise<User> {
  const response = await fetchData("/api/users", { method: "GET" });
  return response.json();
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
  const response = await fetchData("/api/users/signup", {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  });
  return response.json();
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await fetchData("/api/users/login", {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials)
  });
  return response.json();
}

export async function logout() {
  await fetchData("/api/users/logout", { method: "POST" });
}

export async function fetchNotes(): Promise<Note[]> {
  const response = await fetchData("/api/notes", {
    method: "GET",
    mode: "cors",
    credentials: "include"
  });
  return await response.json();
}

export interface NoteInput {
  title: string;
  text?: string;
}

export async function createNote(note: NoteInput): Promise<Note> {
  const response = await fetchData("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    mode: "cors",
    credentials: "include",
    body: JSON.stringify(note)
  });
  return response.json();
}

export async function updateNote(
  noteId: string,
  note: NoteInput
): Promise<Note> {
  const response = await fetchData("/api/notes/" + noteId, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    mode: "cors",
    credentials: "include",
    body: JSON.stringify(note)
  });

  return response.json();
}

export async function deleteNote(noteId: string) {
  await fetchData("api/notes/" + noteId, {
    method: "DELETE",
    mode: "cors",
    credentials: "include",
  });
}
