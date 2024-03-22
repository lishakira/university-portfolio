//
// Author: Shakira Li (z5339356)
// Date: 14/11/2021
//
// Description:
// inputs a book title, author, and pages with command 'i' into a Linked List
// prints all of the inputted book title, author, and pages with command 'p'
//

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "books.h"

struct book {
    char title[MAX_STR_LENGTH];
    char author[MAX_STR_LENGTH];
    int num_pages;
    struct book *next;
};

struct book *insert_book(
    struct book *head, 
    char *title, 
    char *author, 
    int num_pages
) {

    struct book *new_book = malloc(sizeof(struct book));

    strcpy(new_book->title, title);
    strcpy(new_book->author, author);
    new_book->num_pages = num_pages;
    new_book->next = NULL;

    if (head == NULL) {
        head = new_book;
    } else {
        struct book *current = head;

        while (current->next != NULL) {
            current = current->next;
        }

        current->next = new_book;
    }

    return head;
}

void print_books(struct book *head) {

    struct book *current = head;

    while (current != NULL) {
        printf("%s by %s (%d pages)\n", current->title, current->author, 
                                                    current->num_pages);

        current = current->next;
    }

    return;
}
