// Exercise: Find an element in a Linked List
// list_contains.c
//
// This program was written by Shakira Li (z5339356)
// on 05/11/2021
//
// returns 1 if the input is an element of the Linked List
// returns 0 if the input is not an element of the Linked List

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>

#define MAX_STRING_SIZE 1024

struct node {
    struct node *next;
    char         data[MAX_STRING_SIZE];
};

int contains(char *value, struct node *head);
struct node *strings_to_list(int len, char *strings[]);

// DO NOT CHANGE THIS MAIN FUNCTION

int main(int argc, char *argv[]) {
    char value[MAX_STRING_SIZE];
    fgets(value, MAX_STRING_SIZE, stdin);

    // Remove new line if added
    int len = strlen(value);
    if (value[len - 1] == '\n') {
        value[len - 1] = '\0';
    }

    // create linked list from command line arguments
    struct node *head = NULL;
    if (argc > 1) {
        // list has elements
        head = strings_to_list(argc - 1, &argv[1]);
    }

    int result = contains(value, head);
    printf("%d\n", result);

    return 0;
}


// Return 1 if value occurs in linked list, 0 otherwise
int contains(char *value, struct node *head) {

    while (head != NULL) {
        if (strcmp(head->data, value) == 0) {
            return 1;
        }

        head = head->next;
    }

    return 0;
}


// DO NOT CHANGE THIS FUNCTION
// create linked list from array of strings
struct node *strings_to_list(int len, char *strings[]) {
    struct node *head = NULL;
    int i = len - 1;
    while (i >= 0) {
        struct node *n = malloc(sizeof (struct node));
        assert(n != NULL);
        n->next = head;
        strcpy(n->data, strings[i]);
        head = n;
        i -= 1;
    }   
    return head;
}
