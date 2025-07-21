package database

type Database struct {
}

type Note struct {
	ID string // uuid

	Source           string // apple, keep
	SourceIdentifier string // apple: x-code-data://, keep: name
}
