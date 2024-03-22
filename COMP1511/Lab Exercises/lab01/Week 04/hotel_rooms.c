// 
// Written on 08/10/2021
// By Shakira Li (z5339356@unsw.edu.au)
//
// determines which hotel rooms are suitable for the user
//

#include <stdio.h>

#define MAX_ROOMS 50

struct hotel_room {
    // TODO: fill this in with the details of each hotel room
    
    int room_num;
    int capacity;
    double price;
    
};

// Prints the room in the correct format when given the room_number, capacity
// and price of it.
void print_room(int room_number, int capacity, double price);

int main(void) {

    printf("How many rooms? ");
    // TODO: scan in how many rooms in the hotel
    
    int rooms;
    scanf("%d", &rooms);
    
    printf("Enter hotel rooms:\n");
    // TODO: scan in the details of each hotel room
    
    int i = 0;
    struct hotel_room input[MAX_ROOMS];
    while (i < rooms) {
        scanf("%d %d %lf", &input[i].room_num, &input[i].capacity, \
        &input[i].price);
        i++;
    }

    printf("How many people? ");
    // TODO: scan in how many people are in the user's group
    
    int people;
    scanf("%d", &people);
    
    printf("Rooms that fit your group:\n");
    // TODO: print all the rooms that fit the user's group
    
    i = 0;
    while (i < rooms) {
        if (input[i].capacity >= people) {
            print_room(input[i].room_num, input[i].capacity, input[i].price);
        }
        i++;
    }

    return 0;
}

// Prints the room in the correct format when given the room_number, capacity
// and price of it.
//
// Takes in:
// - `room_number` -- The hotel room's room number.
// - `capacity` -- How many people the hotel room can fit.
// - `price` -- How much the hotel room costs.
//
// Returns: nothing.
void print_room(int room_number, int capacity, double price) {

    printf("Room %d (%d people) @ $%.2lf\n", room_number, capacity, price);

    return;
}
