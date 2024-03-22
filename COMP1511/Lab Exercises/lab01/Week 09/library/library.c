// Exercise: Maintain a 2D linked list in a Library
// library.c
//
// This program was written by Shakira Li (z5339356)
// on 14/11/2021
//
// inputs a genre into the library list with command 'g';
// inputs a book title, author, and pages with command 'b' into a genre list;
// prints all of the inputted book title, author, and pages in a speicific
// genrewith command 'p'

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "library.h"

///////////////////////////////////////////////////////////////////////////////
///////////            DO NOT EDIT THIS FUNCTION            ///////////////////
///////////////////////////////////////////////////////////////////////////////
struct library *create_library() {
    struct library *new = malloc(sizeof(struct library));

    new->genres = NULL;
    return new;
}

///////////////////////////////////////////////////////////////////////////////
///////////            DO NOT EDIT THIS FUNCTION            ///////////////////
///////////////////////////////////////////////////////////////////////////////
void add_genre(struct library *lib, char *genre) {
    struct genre *new = malloc(sizeof(struct genre));
    strcpy(new->name, genre);
    new->books = NULL;
    new->next = NULL;

    new->next = lib->genres;
    lib->genres = new;
}


///////////////////////////////////////////////////////////////////////////////
///////////         EDIT ALL FUNCTIONS BELOW HERE           ///////////////////
///////////////////////////////////////////////////////////////////////////////

int add_book_to_genre(
    struct library *lib,
    char *genre,
    char *title,
    char *author,
    int n_pages
) {
    // TODO: Complete this function according to the spec in `library.h`
    struct genre *current = lib->genres;

    while (current != NULL) {
        if (strcmp(current->name, genre) == 0) {
            current->books = insert_book(current->books, title, author, n_pages);
            
            return SUCCESS;
        }

        current = current->next;
    }

    return NOT_FOUND;
}

void print_books_in_genre(struct library *lib, char *genre) {
    // TODO: Complete this function according to the spec in `library.h`
    struct genre *current = lib->genres;

    if (current == NULL || current->books == NULL) {
        printf("No books\n");
    }

    while (current != NULL) {
        if (strcmp(current->name, genre) == 0) {
            print_books(current->books);
        }

        current = current->next;
    }
    
}
