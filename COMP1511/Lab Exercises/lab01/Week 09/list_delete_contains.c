// Exercise: Delete First Element Containing A Value from a Linked List
// list_delete_contains.c
//
// This program was written by Shakira Li (z5339356)
// on 14/11/2021
//
// deletes the inputted value in a Linked List

#include <stdio.h>
#include <stdlib.h>
#include <assert.h>

struct node {
    struct node *next;
    int          data;
};

struct node *delete_contains(int value, struct node *head);
struct node *strings_to_list(int len, char *strings[]);
void print_list(struct node *head);

// DO NOT CHANGE THIS MAIN FUNCTION

int main(int argc, char *argv[]) {
    int value;
    scanf("%d", &value);
    // create linked list from command line arguments
    struct node *head = strings_to_list(argc - 1, &argv[1]);

    struct node *new_head = delete_contains(value, head);
    print_list(new_head);

    return 0;
}


//
// Delete the first node in the list containing the value `value`.
// The deleted node is freed.
// If no node contains `value`, the list is not changed.
// The head of the list is returned.
//
struct node *delete_contains(int value, struct node *head) {

    // empty list
    if (head == NULL) {
        return NULL;
    }

    // only one node in the list
    if (head->next == NULL) {
        if (head->data == value) {
            free(head);
            head = NULL;
        }

        return head;
    }

    // deleting head node from the list
    if (head->data == value) {
        struct node *new_head = head->next;

        free(head);
        head = new_head;
        
        return head;
    }

    // deleting non-head node from the list
    struct node *current = head;

    while (current->next != NULL && current->next->data != value) {
        current = current->next;
    }

    if (current->next->data == value && current->next == NULL) {
        current->next->next = NULL;
    }

    if (current->next->data == value) {
        struct node *new_next = current->next->next;

        free(current->next);
        current->next = new_next;
    }

    return head;

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
        n->data = atoi(strings[i]);
        head = n;
        i -= 1;
    }   
    return head;
}

// DO NOT CHANGE THIS FUNCTION
// print linked list
void print_list(struct node *head) {
    printf("[");    
    struct node *n = head;
    while (n != NULL) {
        // If you're getting an error here,
        // you have returned an invalid list
        printf("%d", n->data);
        if (n->next != NULL) {
            printf(", ");
        }
        n = n->next;
    }
    printf("]\n");
}
