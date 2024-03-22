// z5339356
// calculates when Easter Sunday is on that year 
// Written on 22/09/2021
// by Shakira Li (z5339356@unsw.edu.au)
// for COMP1511 
// Exercise: Easter

#include <stdio.h>

int main(void) {

    int year;
    int month_num;
    int day;
    int alpha;
    int bravo;
    int charlie;
    int delta;
    int echo;
    int foxtrot;
    int golf;
    int hotel;
    int india;
    int kilo;
    int lima;
    int mike;
    int papa;
    printf("Enter year: ");
    scanf("%d", &year);
    alpha = year % 19;
    bravo = year / 100;
    charlie = year % 100;
    delta = bravo / 4;
    echo = bravo % 4;
    foxtrot = (bravo + 8) / 25;
    golf = (bravo - foxtrot + 1) / 3;
    hotel = (19 * alpha + bravo - delta - golf + 15) % 30;
    india = charlie / 4;
    kilo = charlie % 4;
    lima = (32 + 2 * echo + 2 * india - hotel - kilo) % 7;
    mike = (alpha + 11 * hotel + 22 * lima) / 451;
    month_num = (hotel + lima - 7 * mike + 114) / 31;
    papa = (hotel + lima - 7 * mike + 114) % 31;
    day = papa + 1;
    if (month_num == 3) {
        printf("Easter is March %d in %d.\n", day, year);
    } else {
        printf("Easter is April %d in %d.\n", day, year);
    }

    return 0;
}
