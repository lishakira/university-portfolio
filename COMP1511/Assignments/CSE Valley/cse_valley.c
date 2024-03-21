// CSE Valley
// cse_valley.c
//
// This program was written by Shakira Li (z5339356)
// on 18/10/2021 until 26/10/2021
//
// Version 1.0.0 (2021-10-04): Assignment Released.
//
// A farming simulation game that is based on the game "Stardew Valley".
//
// This is a simplified version where:
// 1. The farmer is given an 8 x 8 land to attend to.
// 2. The farmer gets to move left, right, down, and up.
// 3. The farmer gets to plant seeds and harvest them the next day.
// 4. The farmer gets to water a specific area.
// 5. The farmer gets to advance to the next day as the farmer wishes.
// NOTE: There are specific command arguments set up for each action.

#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>

#define STARTING_DAY 1
#define STARTER_SEEDS_GIVEN 60
#define MAX_NAME_SIZE 50
#define MAX_NUM_SEED_TYPES 26
#define MIN_SEED_AMOUNT 0
#define INITIAL_FIND_SEED_INDEX -1
#define FIRST_SEED_INDEX 0
#define NO_SEED ' '
#define HARVESTED_SEEDS 5
#define SEED_IN_QUESTION 1
#define LAND_SIZE 8
#define MIN_LAND_INDEX 0
#define MAX_LAND_INDEX 7
#define TRUE 1
#define FALSE 0
#define NOT_DEAD 1
#define DEAD 0

struct seeds {
    char name;
    int amount;
};

struct land {
    int is_watered;
    char seed_name;
    int seed_condition;
};

struct farmer {
    int curr_col;
    int curr_row;
    char curr_dir;
};

// Shakira's Functions
void print_all_seeds (int diff_types, struct seeds seed_collection[]);
void print_specific_seed (struct seeds seed_collection[]);
int valid_seed (char seed_name, struct seeds seed_collection[]);
int seed_is_lowercase (char seed_name);
void invalid_seed (char seed_name);
int seed_index (char seed_name, struct seeds seed_collection[]);
struct farmer move_around_land (char command, struct farmer cse_farmer);
int check_bound (struct farmer cse_farmer); 
void adj_land_action (struct seeds seed_collection[], 
                      struct land farm_land[LAND_SIZE][LAND_SIZE], 
                      struct farmer cse_farmer);
void water_adj_land (struct land farm_land[LAND_SIZE][LAND_SIZE], 
                     struct farmer cse_farmer);
void seed_adj_land (struct seeds seed_collection[], 
                    struct land farm_land[LAND_SIZE][LAND_SIZE], 
                    struct farmer cse_farmer);
void reduce_seed_amount (char seed_name, struct seeds seed_collection[]);
void scatter_seeds (struct seeds seed_collection[], 
                    struct land farm_land[LAND_SIZE][LAND_SIZE], 
                    struct farmer cse_farmer);
void print_scatter_seeds (char seed_name, struct seeds seed_collection[], 
                          struct land farm_land[LAND_SIZE][LAND_SIZE], 
                          struct farmer cse_farmer);
void square_watering (struct land farm_land[LAND_SIZE][LAND_SIZE], 
                      struct farmer cse_farmer);
void negative_size (int square_size);
void print_square_watering (int square_size, 
                            struct land farm_land[LAND_SIZE][LAND_SIZE], 
                            struct farmer cse_farmer);
int within_farm_land (int row_or_col);
void advance_next_day (int current_day, struct seeds seed_collection[], 
                       struct land farm_land[LAND_SIZE][LAND_SIZE]);
void scan_farm_land (struct seeds seed_collection[], 
                     struct land farm_land[LAND_SIZE][LAND_SIZE]);
void growth_or_death (int row, int col, struct seeds seed_collection[], 
                      struct land farm_land[LAND_SIZE][LAND_SIZE]);
void harvest_adj_land (struct seeds seed_collection[], 
                       struct land farm_land[LAND_SIZE][LAND_SIZE], 
                       struct farmer cse_farmer);
char seed_name_identifier (struct land farm_land[LAND_SIZE][LAND_SIZE], 
                           struct farmer cse_farmer);
void harvested_plant (char seed_name, struct seeds seed_collection[], 
                      struct land farm_land[LAND_SIZE][LAND_SIZE], 
                      struct farmer cse_farmer);
struct seeds trading_seeds (struct seeds seed_collection[], 
                            struct land farm_land[LAND_SIZE][LAND_SIZE], 
                            struct farmer cse_farmer);
int invalid_input_trade (int src_amt, int src_index, char src_name, 
                         char dst_name, struct seeds seed_collection[]);
int seed_is_uppercase (char seed_name);
int not_in_collection (char src_name, struct seeds seed_collection[]);
int negative_amount (int src_amt);
int not_enough_seeds (int src_amt, int src_index,
                      struct seeds seed_collection[]);
void traded_seeds (int src_amt, int src_index, int dst_index, 
                   char dst_name, struct seeds seed_collection[]);
struct seeds index_rearrangement (int index, struct seeds seed_collection[]);
void natural_disasters (struct seeds seed_collection[], 
                        struct land farm_land[LAND_SIZE][LAND_SIZE]);
void disaster_drought (struct seeds seed_collection[], 
                       struct land farm_land[LAND_SIZE][LAND_SIZE]);
void disaster_wind_storm (struct seeds seed_collection[], 
                          struct land farm_land[LAND_SIZE][LAND_SIZE]);
void disaster_simulation (int min_num_plants_to_survive, int dead_or_not_one, 
                          int dead_or_not_two, struct seeds seed_collection[], 
                          struct land farm_land[LAND_SIZE][LAND_SIZE]);
void survive_or_death (int row, int col, int min_num_plants_to_survive, 
                       int dead_or_not_one, int dead_or_not_two, 
                       struct seeds seed_collection[], 
                       struct land farm_land[LAND_SIZE][LAND_SIZE]);
int evaluate_land_area (int row, int col, int seeds_in_land_area, 
                        struct seeds seed_collection[], 
                        struct land farm_land[LAND_SIZE][LAND_SIZE]);
int seed_is_present (int row_start, int col_start, int seeds_in_land_area, 
                     struct seeds seed_collection[], 
                     struct land farm_land[LAND_SIZE][LAND_SIZE]);
void remove_dead_seeds (struct land farm_land[LAND_SIZE][LAND_SIZE]);

// Provided Functions
void print_land(struct land farm_land[LAND_SIZE][LAND_SIZE], 
                struct farmer cse_farmer);
struct farmer initialise_farmer(struct farmer cse_farmer);
void initialise_seeds(struct seeds seed_collection[MAX_NUM_SEED_TYPES]);
void initialise_land(struct land farm_land[LAND_SIZE][LAND_SIZE]);

// Helper Functions
void print_top_row(struct land farm_land[LAND_SIZE][LAND_SIZE], int row);
void print_farmer_row(struct land farm_land[LAND_SIZE][LAND_SIZE], 
                      struct farmer cse_farmer);

int main(void) {

    struct seeds seed_collection[MAX_NUM_SEED_TYPES];
    initialise_seeds(seed_collection);

    struct land farm_land[LAND_SIZE][LAND_SIZE];
    initialise_land(farm_land);

    struct farmer cse_farmer = {};
    cse_farmer = initialise_farmer(cse_farmer);
    
    // number of different seed types
    int diff_types; 
    char command; 
    int current_day = STARTING_DAY;

    printf("Welcome to CSE Valley, farmer!\n");
    printf("Congratulations, you have received 60 seeds.\n");
    
    printf("How many different seeds do you wish to have? ");
    scanf("%d", &diff_types);
    
    printf("Enter the names of the seeds to be given:\n");
    
    int i = 0;
    while (i < diff_types) {
        scanf(" %c", &seed_collection[i].name);
        seed_collection[i].amount = STARTER_SEEDS_GIVEN / diff_types;
        i++;
    }
    
    printf("Game Started!\n");

    printf("Enter command: ");

    while (scanf(" %c", &command) != EOF) {

        if (command == 'a') {
            print_all_seeds(diff_types, seed_collection);
        } else if (command == 's') {
            print_specific_seed(seed_collection);
        } else if (command == 'l') {
            print_land(farm_land, cse_farmer);
        } else if (command == '>' || command == '<') {
            cse_farmer = move_around_land(command, cse_farmer);
        } else if (command == 'v' || command == '^') {
            cse_farmer = move_around_land(command, cse_farmer);
        } else if (command == 'o') {
            adj_land_action(seed_collection, farm_land, cse_farmer);
        } else if (command == 'p') {
            scatter_seeds(seed_collection, farm_land, cse_farmer);
        } else if (command == 'w') {
            square_watering(farm_land, cse_farmer);
        } else if (command == 'n') {
            current_day++;

            advance_next_day(current_day, seed_collection, farm_land);

            cse_farmer = initialise_farmer(cse_farmer);
        } else if (command == 'h') {
            harvest_adj_land(seed_collection, farm_land, cse_farmer);
        } else if (command == 't') {
            trading_seeds(seed_collection, farm_land, cse_farmer);
        } else if (command == 'd') {
            natural_disasters(seed_collection, farm_land);
        }
    
        printf("Enter command: ");
    }

    return 0;
}

/////////////////////////////////
//     Shakira's Functions     //
/////////////////////////////////

// COMMAND ARGUMENT: a
// prints the amounts of seeds per seed type the farmer has
void print_all_seeds (int diff_types, struct seeds seed_collection[]) {
    printf("  ");
    printf("Seeds at your disposal:\n");
            
    int i = 0;
    while (i < MAX_NUM_SEED_TYPES) {

        if (valid_seed(seed_collection[i].name, seed_collection) == TRUE) {
            printf("  ");
            printf("- %d seed(s) with the name '%c'\n", 
                   seed_collection[i].amount, seed_collection[i].name);
        }
        
        i++;
    }
}

// COMMAND ARGUMENT: s (seed_name)
// prints the amount of seeds of that specified seed type the farmer has
void print_specific_seed (struct seeds seed_collection[]) {
    char seed_name;
    scanf(" %c", &seed_name);
    
    int index = seed_index(seed_name, seed_collection);
    
    if (valid_seed(seed_name, seed_collection) == TRUE) {
        printf("  ");
        printf("There are %d seeds with the name '%c'\n", 
                seed_collection[index].amount, seed_name);
    } else {
        invalid_seed(seed_name);
    }
}

// checks whether a seed is part of the farmer's seed collection
int valid_seed (char seed_name, struct seeds seed_collection[]) {
    int index = seed_index(seed_name, seed_collection);
    
    if (seed_is_lowercase(seed_name) == TRUE) {

        if (seed_name == seed_collection[index].name) {
            return TRUE;
        }

    }
    
    return FALSE;
}

// checks whether the seed_name is in lowercase letter
int seed_is_lowercase (char seed_name) {
    if (seed_name >= 'a' && seed_name <= 'z') {
        return TRUE;
    }
    
    return FALSE;
}

// prints the invalid statements if the seed_name is not in the seed collection
void invalid_seed (char seed_name) {
    if (seed_is_lowercase(seed_name) == TRUE) {
        printf("  ");
        printf("There is no seed with the name '%c'\n", seed_name);
    } else {
        printf("  ");
        printf("Seed name has to be a lowercase letter\n");
    }
}

// finds the index of a specific seed in the seed collection
int seed_index (char seed_name, struct seeds seed_collection[]) {
    int index = INITIAL_FIND_SEED_INDEX;
    
    int i = 0;
    while (i < MAX_NUM_SEED_TYPES) {

        if (seed_name == seed_collection[i].name) {
            i = MAX_NUM_SEED_TYPES;
        }
        
        i++;
        index++;
    }
    
    return index;
}

// COMMAND ARGUMENTS: > (= right), < (= left), v (= down), or ^ (= up)
// helps the farmer to move around the farm land
struct farmer move_around_land (char command, struct farmer cse_farmer) {
    if (cse_farmer.curr_dir == command && check_bound(cse_farmer) == TRUE) {

        if (command == '>') {
            cse_farmer.curr_col++;
        } else if (command == '<') {
            cse_farmer.curr_col--;
        } else if (command == 'v') {
            cse_farmer.curr_row++;
        } else if (command == '^') {
            cse_farmer.curr_row--;
        }

    } else {
        cse_farmer.curr_dir = command;
    }
    
    return cse_farmer;
}

// checks if the farmer is within the farm land 
int check_bound (struct farmer cse_farmer) {
    int row = cse_farmer.curr_row;
    int col = cse_farmer.curr_col;
    int dir = cse_farmer.curr_dir;
    
    if (col == MIN_LAND_INDEX && dir == '<') {
        return FALSE;
    } else if (col == MAX_LAND_INDEX && dir == '>') {
        return FALSE;
    } else if (row == MIN_LAND_INDEX && dir == '^') {
        return FALSE;
    } else if (row == MAX_LAND_INDEX && dir == 'v') {
        return FALSE;
    }

    return TRUE;
}

// COMMAND ARGUMENT: o (land_action)
// allows the farmer to water or plant a seed to its adjacent land
void adj_land_action (struct seeds seed_collection[], 
                      struct land farm_land[LAND_SIZE][LAND_SIZE], 
                      struct farmer cse_farmer) {
    char land_action;
    scanf(" %c", &land_action);
    
    if (land_action == 'w') {

        if (check_bound(cse_farmer) == TRUE) {
            water_adj_land(farm_land, cse_farmer);
        }

    } else if (land_action == 'p') {

        if (check_bound(cse_farmer) == TRUE) {
            seed_adj_land(seed_collection, farm_land, cse_farmer);
        }

    }
}

// COMMAND ARGUMENT: o w
// prints a W on the upper right side of the land chosen to be watered
void water_adj_land (struct land farm_land[LAND_SIZE][LAND_SIZE], 
                     struct farmer cse_farmer) {
    int row = cse_farmer.curr_row;
    int col = cse_farmer.curr_col;
    int dir = cse_farmer.curr_dir;
    
    if (dir == '>') {
        farm_land[row][col + 1].is_watered = TRUE;
    } else if (dir == '<') {
        farm_land[row][col - 1].is_watered = TRUE;
    } else if (dir == 'v') {
        farm_land[row + 1][col].is_watered = TRUE;
    } else if (dir == '^') {
        farm_land[row - 1][col].is_watered = TRUE;
    }
}

// COMMAND ARGUMENT: o p (seed_name)
// prints the seed name on the upper left side of the land chosen to be seeded
void seed_adj_land (struct seeds seed_collection[],  
                    struct land farm_land[LAND_SIZE][LAND_SIZE],   
                    struct farmer cse_farmer) {
    char seed_name;
    scanf(" %c", &seed_name);
    
    int row = cse_farmer.curr_row;
    int col = cse_farmer.curr_col;
    int dir = cse_farmer.curr_dir;
    
    if (valid_seed(seed_name, seed_collection) == TRUE) {

        if (dir == '>') {
            farm_land[row][col + 1].seed_name = seed_name;
        } else if (dir == '<') {
            farm_land[row][col - 1].seed_name = seed_name;
        } else if (dir == 'v') {
            farm_land[row + 1][col].seed_name = seed_name;
        } else if (dir == '^') {
            farm_land[row - 1][col].seed_name = seed_name;
        }
        
        reduce_seed_amount(seed_name, seed_collection);
    } 
}

// reduces the amount of seeds of a specific seed type in a seed collection
// once the seed has been planted
void reduce_seed_amount (char seed_name, struct seeds seed_collection[]) {
    int index = seed_index (seed_name, seed_collection);

    seed_collection[index].amount--;
}

// COMMAND ARGUMENT: p (seed_name)
// allows the farmer to plant a line of seeds starting from the farmer
// Limit(s): the seeds cannot be scattered upwards or leftwards
void scatter_seeds (struct seeds seed_collection[], 
                    struct land farm_land[LAND_SIZE][LAND_SIZE], 
                    struct farmer cse_farmer) {
    char seed_name;
    scanf(" %c", &seed_name);
    
    int dir = cse_farmer.curr_dir;

    if (valid_seed(seed_name, seed_collection) == TRUE) {

        if (dir == '>' || dir == 'v') {
            print_scatter_seeds(seed_name, seed_collection, farm_land, 
                                cse_farmer);
        } else {
            printf("  ");
            printf("You cannot scatter seeds ^ or <\n");
        }

    } else {
        invalid_seed(seed_name);
    }
}

// prints linearly the seed name on the upper left side(s) of the land(s)
// Limit(s): cannot go beyond the farm land
void print_scatter_seeds (char seed_name, struct seeds seed_collection[], 
                          struct land farm_land[LAND_SIZE][LAND_SIZE], 
                          struct farmer cse_farmer) {
    int row = cse_farmer.curr_row;
    int col = cse_farmer.curr_col;
    int dir = cse_farmer.curr_dir;
    int index = seed_index (seed_name, seed_collection);
    
    if (dir == '>') {

        while (col < LAND_SIZE && seed_collection[index].amount 
               > MIN_SEED_AMOUNT) {
            farm_land[row][col].seed_name = seed_name;

            reduce_seed_amount(seed_name, seed_collection);

            col++;
        }

    } else if (dir == 'v') {

        while (row < LAND_SIZE && seed_collection[index].amount 
               > MIN_SEED_AMOUNT) {
            farm_land[row][col].seed_name = seed_name;

            reduce_seed_amount(seed_name, seed_collection);

            row++;
        }

    }
}

// COMMAND ARGUMENT: w (square_size)
// allows the farmer to water a square section of the farm land
void square_watering (struct land farm_land[LAND_SIZE][LAND_SIZE], 
                      struct farmer cse_farmer) {
    int square_size;
    scanf("%d", &square_size);
    
    negative_size(square_size);
    
    print_square_watering(square_size, farm_land, cse_farmer);
}

// prints the invalid statement for negative square_size
void negative_size (int square_size) {
    if (square_size < 0) {
        printf("  ");
        printf("The size argument needs to be a non-negative integer\n");
        
        return;
    }
}

// prints a W to the square section of the farm land the farmer chooses to water
void print_square_watering (int square_size, 
                            struct land farm_land[LAND_SIZE][LAND_SIZE], 
                            struct farmer cse_farmer) {
    int row_start = cse_farmer.curr_row - square_size;
    int row_end = cse_farmer.curr_row + square_size;
    
    row_start = within_farm_land(row_start);
    
    while (row_start <= row_end && row_start < LAND_SIZE) {
        int col_start = cse_farmer.curr_col - square_size;
        int col_end = cse_farmer.curr_col + square_size;
        
        col_start = within_farm_land(col_start);

        while (col_start <= col_end && col_start < LAND_SIZE) {
            farm_land[row_start][col_start].is_watered = TRUE;

            col_start++;
        }
        
        row_start++;
    }
}

// checks whether the starting point is within the farm land
int within_farm_land (int row_or_col) {
    if (row_or_col < MIN_LAND_INDEX) {
        row_or_col = MIN_LAND_INDEX;
    }
    
    return row_or_col;
}

// COMMAND ARGUMENT: n
// allows the farmer to advance to the next day
// seeds will either grow or die the next day depending on which day it is
void advance_next_day (int current_day, struct seeds seed_collection[], 
                       struct land farm_land[LAND_SIZE][LAND_SIZE]) {
    printf("  ");
    printf("Advancing to the next day... Day %d, let's go!\n", current_day);
    
    if (current_day % 2 == 0) {
        scan_farm_land(seed_collection, farm_land);
    } else {
        initialise_land(farm_land);
    }
}

// scans the farm land for seeds that will either grow or die
void scan_farm_land (struct seeds seed_collection[], 
                     struct land farm_land[LAND_SIZE][LAND_SIZE]) {
    int row = MIN_LAND_INDEX;   
    while (row < LAND_SIZE) {

        int col = MIN_LAND_INDEX;
        while (col < LAND_SIZE) {
            growth_or_death(row, col, seed_collection, farm_land);

            col++;
        }
        
        row++;
    }
}

// prints the seed's uppercase form on the upper left side of the land if the 
// seed grows; otherwise, it gets removed from the land and prints nothing 
void growth_or_death (int row, int col, struct seeds seed_collection[], 
                      struct land farm_land[LAND_SIZE][LAND_SIZE]) {
    char seed_name = farm_land[row][col].seed_name;

    if (farm_land[row][col].is_watered == TRUE) {

        if (valid_seed(seed_name, seed_collection) == TRUE) {
            seed_name = toupper(seed_name);
        }

    } else {
        seed_name = NO_SEED;
    }
    
    farm_land[row][col].is_watered = FALSE;
    farm_land[row][col].seed_name = seed_name;
}

// COMMAND ARGUMENT: h
// allows the farmer to harvest the plant from its adjacent land
void harvest_adj_land (struct seeds seed_collection[], 
                       struct land farm_land[LAND_SIZE][LAND_SIZE], 
                       struct farmer cse_farmer) {
    if (check_bound(cse_farmer) == FALSE) {
        return;
    }
    
    char seed_name = seed_name_identifier(farm_land, cse_farmer);
    
    if (valid_seed(seed_name, seed_collection) == TRUE) {       
        harvested_plant(seed_name, seed_collection, farm_land, cse_farmer);
        
        printf("  ");
        printf("Plant '%c' was harvested, resulting in 5 '%c' seed(s)\n", 
               toupper(seed_name), seed_name);
    }
}

// identifies the seed_name of the plant the farmer wishes to harvest
char seed_name_identifier (struct land farm_land[LAND_SIZE][LAND_SIZE], 
                           struct farmer cse_farmer) {
    int row = cse_farmer.curr_row;
    int col = cse_farmer.curr_col;
    int dir = cse_farmer.curr_dir;
    char seed_name = NO_SEED;
    
    if (dir == '>') {
        seed_name = tolower(farm_land[row][col + 1].seed_name);
    } else if (dir == '<') {
        seed_name = tolower(farm_land[row][col - 1].seed_name);
    } else if (dir == 'v') {
        seed_name = tolower(farm_land[row + 1][col].seed_name);
    } else if (dir == '^') {
        seed_name = tolower(farm_land[row - 1][col].seed_name);
    }
    
    return seed_name;
}

// once plant has been harvested, the land reinitialises to have NO_SEED
// each plant type harvested will result to five seeds of the same type
void harvested_plant (char seed_name, struct seeds seed_collection[], 
                      struct land farm_land[LAND_SIZE][LAND_SIZE], 
                      struct farmer cse_farmer) {
    int row = cse_farmer.curr_row;
    int col = cse_farmer.curr_col;
    int dir = cse_farmer.curr_dir;
    int index = seed_index(seed_name, seed_collection);
    
    seed_collection[index].amount += HARVESTED_SEEDS;
    
    if (dir == '>') {
        farm_land[row][col + 1].seed_name = NO_SEED;
    } else if (dir == '<') {
        farm_land[row][col - 1].seed_name = NO_SEED;
    } else if (dir == 'v') {
        farm_land[row + 1][col].seed_name = NO_SEED;
    } else if (dir == '^') {
        farm_land[row - 1][col].seed_name = NO_SEED;
    }
}

// COMMAND ARGUMENT: t (src_name) (src_amt) (dst_name)
// allows the farmer to trade his seeds for seeds of another type 
struct seeds trading_seeds (struct seeds seed_collection[], 
                            struct land farm_land[LAND_SIZE][LAND_SIZE], 
                            struct farmer cse_farmer) {
    // name of the seed to be traded away
    char src_name;
    scanf(" %c", &src_name);
    
    // amount of seeds to be traded 
    int src_amt;
    scanf("%d", &src_amt);
    
    // name of the seed src_name is being traded for 
    char dst_name;
    scanf(" %c", &dst_name);

    // index of the seed to be traded away
    int src_index = seed_index(src_name, seed_collection);
    // index of the seed src_name is being traded for 
    int dst_index = seed_index(dst_name, seed_collection);

    if (invalid_input_trade(src_amt, src_index, src_name, 
                            dst_name, seed_collection) == TRUE) {
        return *seed_collection;
    } else {
        traded_seeds(src_amt, src_index, dst_index, dst_name, 
                     seed_collection);
    }

    return *seed_collection;
}

// checks whether a command argument inputted for trading_seeds is invalid
int invalid_input_trade (int src_amt, int src_index, char src_name, 
                         char dst_name, struct seeds seed_collection[]) {
    if (seed_is_uppercase(src_name) == TRUE) {
        return TRUE;
    } else if (seed_is_uppercase(dst_name) == TRUE) {
        return TRUE;
    } else if (not_in_collection(src_name, seed_collection) == TRUE) {
        return TRUE;
    } else if (negative_amount(src_amt) == TRUE) {
        return TRUE;
    } else if (not_enough_seeds(src_amt, src_index, seed_collection) 
               == TRUE) {
        return TRUE;
    }
    
    return FALSE;
}

// prints the invalid statement for a seed_name in uppercase letter
int seed_is_uppercase (char seed_name) {
    if (seed_is_lowercase(seed_name) == FALSE) {
        printf("  ");
        printf("Seed name has to be a lowercase letter\n");
        
        return TRUE;
    }  
    
    return FALSE; 
}

// prints the invalid statement for seeds that are not in the seed collection
int not_in_collection (char src_name, struct seeds seed_collection[]) {
    if (valid_seed(src_name, seed_collection) == FALSE) {
        printf("  ");
        printf("You don't have the seeds to be traded\n");
        
        return TRUE;
    }  
    
    return FALSE; 
}

// prints the invalid statement for negative amount of seeds
int negative_amount (int src_amt) {
    if (src_amt < MIN_SEED_AMOUNT) {
        printf("  ");
        printf("You can't trade negative seeds\n");
    
        return TRUE;
    }  
    
    return FALSE; 
}

// prints the invalid statement for insufficient seeds to be traded
int not_enough_seeds (int src_amt, int src_index, 
                      struct seeds seed_collection[]) {
    if (src_amt > seed_collection[src_index].amount) {
        printf("  ");
        printf("You don't have enough seeds to be traded\n");
        
        return TRUE;
    }  
    
    return FALSE; 
}

// src_name's amount of seeds decreases by src_amt
// dst_name's amount of seeds increases by src_amt
void traded_seeds (int src_amt, int src_index, int dst_index, 
                   char dst_name, struct seeds seed_collection[]) {
    char seed_name = NO_SEED;
    int index = seed_index(seed_name, seed_collection);
    
    if (valid_seed(dst_name, seed_collection) == TRUE) {
        seed_collection[dst_index].amount += src_amt;
        seed_collection[src_index].amount -= src_amt;
    } else {
        seed_collection[index].name = dst_name;
        seed_collection[index].amount += src_amt;
        seed_collection[src_index].amount -= src_amt;

        index_rearrangement(index, seed_collection);
    }
}

// rearranges the seed types' order so that the new seed type become the first 
// seed type to appear in the seed collection
struct seeds index_rearrangement (int index, struct seeds seed_collection[]) {
    char temp_name = seed_collection[index].name;
    int temp_amount = seed_collection[index].amount;
    
    while (index > MIN_LAND_INDEX) {
        seed_collection[index].name = seed_collection[index - 1].name;
        seed_collection[index].amount = seed_collection[index - 1].amount;

        index--;
    }
    
    seed_collection[FIRST_SEED_INDEX].name = temp_name;
    seed_collection[FIRST_SEED_INDEX].amount = temp_amount;
    
    return *seed_collection;
}

// COMMAND ARGUMENT: d (disaster) (min_num_plants_to_(die or survive))
// allows the farmer to simulate droughts and wind storms in his own farm
void natural_disasters (struct seeds seed_collection[], 
                        struct land farm_land[LAND_SIZE][LAND_SIZE]) {
    char disaster;
    scanf(" %c", &disaster);

    if (disaster == 'd') {
        disaster_drought(seed_collection, farm_land);
    } else if (disaster == 'w') {
        disaster_wind_storm(seed_collection, farm_land);
    }
}

// COMMAND ARGUMENT: d d (min_num_plants_to_die)
// simulates droughts in the farm land in which any seed or plant that is 
// surrounded by too many seeds or plants will die and get removed from land
void disaster_drought (struct seeds seed_collection[], 
                       struct land farm_land[LAND_SIZE][LAND_SIZE]) {
    int min_num_plants_to_die;
    scanf("%d", &min_num_plants_to_die);

    disaster_simulation(min_num_plants_to_die, DEAD, NOT_DEAD, 
                        seed_collection, farm_land);
}

// COMMAND ARGUMENT: d w (min_num_plants_to_survive)
// simulates wind storms in the farm land in which any seed or plant that is 
// not surrounded by too many seeds or plants will die and get removed from land
void disaster_wind_storm (struct seeds seed_collection[], 
                          struct land farm_land[LAND_SIZE][LAND_SIZE]) {
    int min_num_plants_to_survive;
    scanf("%d", &min_num_plants_to_survive);
    
    disaster_simulation(min_num_plants_to_survive, NOT_DEAD, DEAD, 
                        seed_collection, farm_land);
}

// performs the disaster and removes any seed that dies after the simulation
void disaster_simulation (int min_num_plants, int dead_or_not_one, 
                          int dead_or_not_two, struct seeds seed_collection[], 
                          struct land farm_land[LAND_SIZE][LAND_SIZE]) {
    int row = MIN_LAND_INDEX;
    while (row < LAND_SIZE) {

        int col = MIN_LAND_INDEX;
        while (col < LAND_SIZE) {
            survive_or_death(row, col, min_num_plants, dead_or_not_one, 
                             dead_or_not_two, seed_collection, farm_land);

            col++;
        }

        row++;
    }

    remove_dead_seeds(farm_land);
}

// decides whether a seed or plant dies by checking its surrounding area
void survive_or_death (int row, int col, int min_num_plants, 
                       int dead_or_not_one, int dead_or_not_two, 
                       struct seeds seed_collection[], 
                       struct land farm_land[LAND_SIZE][LAND_SIZE]) {
    int surrounding_seeds = MIN_SEED_AMOUNT;
    char seed_name = farm_land[row][col].seed_name;

    if (valid_seed(seed_name, seed_collection) == TRUE) {
        surrounding_seeds = evaluate_land_area(row, col, surrounding_seeds, 
                                               seed_collection, farm_land);

        if (surrounding_seeds >= min_num_plants) {
            farm_land[row][col].seed_condition = dead_or_not_one;
        } else {
            farm_land[row][col].seed_condition = dead_or_not_two;
        }

    }
}

// evaluates how many seeds are surrounding the seed in question
int evaluate_land_area (int row, int col, int seeds_in_land_area, 
                        struct seeds seed_collection[], 
                        struct land farm_land[LAND_SIZE][LAND_SIZE]) {
    int row_start = row - SEED_IN_QUESTION;
    int row_end = row + SEED_IN_QUESTION;

    row_start = within_farm_land(row_start);

    while (row_start <= row_end && row_start < LAND_SIZE) {
        int col_start = col - SEED_IN_QUESTION;
        int col_end = col + SEED_IN_QUESTION;

        col_start = within_farm_land(col_start);

        while (col_start <= col_end && col_start < LAND_SIZE) {
            seeds_in_land_area = seed_is_present(row_start, col_start, 
                                                 seeds_in_land_area, 
                                                 seed_collection, farm_land);

            col_start++;
        }

        row_start++;
    }

    int surrounding_seeds = seeds_in_land_area - SEED_IN_QUESTION;

    return surrounding_seeds;
}

// checks whether there is a seed or plant in the surrounding land area
int seed_is_present (int row_start, int col_start, int seeds_in_land_area, 
                     struct seeds seed_collection[], 
                     struct land farm_land[LAND_SIZE][LAND_SIZE]) {
    char seed_name = farm_land[row_start][col_start].seed_name;

    if (valid_seed(seed_name, seed_collection) == TRUE) {
        seeds_in_land_area++;
    }

    return seeds_in_land_area;
}

// removes all the dead seeds from farm land by printing nothing 
void remove_dead_seeds (struct land farm_land[LAND_SIZE][LAND_SIZE]) {
    int row = MIN_LAND_INDEX;
    while (row < LAND_SIZE) {

        int col = MIN_LAND_INDEX;
        while (col < LAND_SIZE) {

            if (farm_land[row][col].seed_condition == DEAD) {
                farm_land[row][col].seed_name = NO_SEED;
                farm_land[row][col].seed_condition = NOT_DEAD;
            }

            col++;
        }

        row++;
    }
}

////////////////////////////////
//     Provided Functions     //
////////////////////////////////

// Prints the structs land (including locating where the
// farmer is)
// You will need this function in Stage 2.
void print_land(struct land farm_land[LAND_SIZE][LAND_SIZE],
                struct farmer cse_farmer) {
    printf("|---|---|---|---|---|---|---|---|\n");

    int i = 0;
    while (i < LAND_SIZE) {
        print_top_row(farm_land, i);

        // only prints mid and bottom row when the farmer
        // is in that row
        if (i == cse_farmer.curr_row) {
            print_farmer_row(farm_land, cse_farmer);
        }

        printf("|---|---|---|---|---|---|---|---|\n");

        i++;
    }
}

// NOTE: You do not need to directly call any of the functions
// below this point. You are allowed to modify them, but you
// do not need to.

// Initialises struct farmer to its default state upon starting
// in which the farmer will be on the top left of the farm
// facing to the right (as noted by '>')
struct farmer initialise_farmer(struct farmer cse_farmer) {
    cse_farmer.curr_col = MIN_LAND_INDEX;
    cse_farmer.curr_row = MIN_LAND_INDEX;
    cse_farmer.curr_dir = '>';

    return cse_farmer;
}

// Initialises a 2d array of struct land to its default state 
// upon starting, which is that all land is unwatered, contains no seed, 
// and the seed is not dead regardless if there is seed or not
void initialise_land(struct land farm_land[LAND_SIZE][LAND_SIZE]) {
    int i = 0;
    while (i < LAND_SIZE) {

        int j = 0;
        while (j < LAND_SIZE) {
            farm_land[i][j].is_watered = FALSE;
            farm_land[i][j].seed_name = NO_SEED;
            farm_land[i][j].seed_condition = NOT_DEAD;

            j++;
        }

        i++;
    }
}

// Initialises struct farmer to its default state upon starting,
// which that all names are initialised as NO_SEED and its
// amount is 0
void initialise_seeds(struct seeds seed_collection[MAX_NUM_SEED_TYPES]) {
    int i = 0;
    while (i < MAX_NUM_SEED_TYPES) {
        seed_collection[i].amount = MIN_SEED_AMOUNT;
        seed_collection[i].name = NO_SEED;

        i++;
    }
}

////////////////////////////////
//      Helper Functions      //
////////////////////////////////

// prints the top row of a particular struct land
void print_top_row(struct land farm_land[LAND_SIZE][LAND_SIZE], int row) {
    int j = 0;
    while (j < LAND_SIZE) {
        printf("|");
        printf("%c", farm_land[row][j].seed_name);
        printf(" ");

        if (farm_land[row][j].is_watered == TRUE) {
            printf("W");
        } else {
            printf(" ");
        }

        j++;
    }

    printf("|");
    printf("\n");
}

// prints the 2 additional row when a farmer is in
// a particular row
void print_farmer_row(struct land farm_land[LAND_SIZE][LAND_SIZE], 
                      struct farmer cse_farmer)  {
    int j = 0;
    while (j < LAND_SIZE) {
        printf("|");

        if (j == cse_farmer.curr_col) {

            if (cse_farmer.curr_dir == '<') {
                printf("<");
            } else {
                printf(" ");
            }

            if (cse_farmer.curr_dir == '^') {
                printf("^");
            } else {
                printf("f");
            }

            if (cse_farmer.curr_dir == '>') {
                printf(">");
            } else {
                printf(" ");
            }
            
        } else {
            printf("   ");
        }

        j++;
    }

    printf("|");
    printf("\n");

    j = 0;
    while (j < LAND_SIZE) {
        printf("|");

        if (j == cse_farmer.curr_col) {
            printf(" ");

            if (cse_farmer.curr_dir == 'v') {
                printf("v");
            } else if (cse_farmer.curr_dir == '^') {
                printf("f");
            } else {
                printf(" ");
            }
            
            printf(" ");
        } else {
            printf("   ");
        }

        j++;
    }
    
    printf("|");
    printf("\n");
}
