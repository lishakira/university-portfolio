//
// Assignment 2 21T3 COMP1511: CS Pizzeria
// pizzeria.c
//
// This program was written by Shakira Li (z5339356)
// on 09/11/2021 to 18/11/2021
//
// A virtual Pizzeria manager that is based on the game Papa's Pizzeria.
//
// This managing program has the following features:
// 1. Create a Pizzeria.
// 2. Create orders and store the data in the memory.
// 3. Determine which order has the closest deadline.
// 4. Select a specific order by going to the next or previous order.
// 5. Add ingredients into a selected order and store the data in the memory.
// 6. Calculate the total profit for a selected order.
// 7. Cancel an order created and free all the associated memory.
// 8. Free all the associated memory of a Pizzeria.
// 9. Refill the stock of ingredients.
// 10. Determine if an order can be completed.
// 11. Complete an order.
// 12. Save the ingredients of a selected order into a file.
// 13. Load the ingredients in a saved file into a selected order.
// 14. Print the following (if they are not empty):
// - all the orders created 
// - the selected order and its ingredients 
// - the ingredients in stock 
// NOTE: This program is case sensitive.
//
// Version 1.0.0: Release


#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "pizzeria.h"
#include "save_string.h"


#define VALID_ORDER 0
#define INITIAL_ORDER_NUMBER 1  
#define ORDER_NUMBER_INCREMENT 1
#define INITIAL_INGREDIENT_EXPENSES 0.0
#define SAME_INGREDIENT 0
#define NO_SAME_INGREDIENT 1
#define SUFFICIENT_STOCK 0
#define EMPTY_STRING ""
#define INGREDIENT_SEPARATOR "|"


struct ingredient {
    char ingredient_name[MAX_STR_LENGTH];
    int amount;
    double price;
    struct ingredient *next;
};

struct order {
    char customer[MAX_STR_LENGTH];
    char pizza_name[MAX_STR_LENGTH];
    double price;
    int time_allowed;
    struct order *next;
    struct order *previous;
    struct ingredient *ingredients;
};

struct pizzeria {
    struct order *orders;
    struct order *selected_order;
    struct ingredient *stock;
};


////////////////////////////////////////////////////////////////////////
//               Shakira's Helper Function Prototypes                 //
////////////////////////////////////////////////////////////////////////


///////////////////////////////////
//       Stage 1 Functions       //
///////////////////////////////////

// checks whether or not an order's price and time is valid
int add_order_validity(
    double price,
    int time_allowed
);

// add the created order into the end of the linked list of orders
struct order *insert_order(
    struct order *new_order,
    struct order *head_order
);

// creates a new order to be added into linked list of orders
struct order *create_order(
    char *customer,
    char *pizza_name,
    double price,
    int time_allowed,
    struct order *new_next,
    struct order *new_previous,
    struct ingredient *ingredient_list
);


///////////////////////////////////
//       Stage 2 Functions       //
///////////////////////////////////

// prints all the ingredients in the linked list of ingredients for the
// selected order
void print_all_ingredients(struct ingredient *ingredients);

// checks whether or not there is a selected order;
// if there is, it checks whether an ingredient's price and amount is valid
int add_ingredient_validity(
    struct order *selected_order,
    double price,
    int amount
);

// adds the ingredient (new or existingg) into linked list of ingredients
void add_ingredient_ordered(
    struct pizzeria *pizzeria,
    char *ingredient_name,
    int amount,
    double price
);

// checks if the ingredient is in the linked list of ingredients;
// if it is, it adds amount into the exisiting ingredient's amount
int add_exisiting_ingredient(
    struct ingredient *ingredients,
    char *ingredient_name,
    int amount
);

// creates a new order to be added into linked list of orders
struct ingredient *create_ingredient(
    char *ingredient_name,
    int amount,
    double price,
    struct ingredient *new_next
);

// inserts the created ingredient alphabetically into linked list of ingredients
struct ingredient *insert_ingredient(
    struct ingredient *new_ingredient, 
    struct ingredient *head_ingredient
);

// calculates the total expense for all the ingredients in the selected order
double calculate_ingredient_expenses(struct ingredient *ingredients);


///////////////////////////////////
//       Stage 3 Functions       //
///////////////////////////////////

// frees all associated memory of the selected order
void free_an_order(struct pizzeria *pizzeria);

// frees all associated memory of the head in the linked list of orders
void free_head_order(struct pizzeria *pizzeria);

// frees all associated memory of the non-head in the linked list of orders 
void free_non_head_orders(struct pizzeria *pizzeria);

// frees all associated memory of all the ingredients in a selected order
void free_ingredients(struct ingredient *ingredients);

// frees all associated memory of all the orders
void free_all_orders(struct order *orders);

// checks whether or not stock's price and amount is valid
int refill_stock_validity(
    double price,
    int amount
);

// checks whether or not an ingredient is in stock
int in_stock(
    struct ingredient *stock,
    struct ingredient *current_ingredient
);

// checks whether or not an there is sufficient stock for a certain ingredient
int stock_status(
    int stock_amount,
    int ingredient_amount
);


///////////////////////////////////
//       Stage 4 Functions       //
///////////////////////////////////

// deducts the ingredient's order amount from the ingredient's stock amount
void deduct_ingredient(
    struct ingredient *ingredients,
    struct ingredient *stock
);

// performs the reduction of the stock amount of the selected ingredient
void deduct_from_stock(
    struct ingredient *stock,
    struct ingredient *current_ingredient
);

// frees all associated memory of the the ingredient with no stock left
void free_zero_stock(
    struct ingredient *ingredient_in_question,
    struct ingredient *stock
);

// frees all associated memory of the head in the linked list of stock
void free_head_stock(
    struct ingredient *ingredient_in_question,
    struct ingredient *stock
);

// frees all associated memory of the non-head in the linked list of stock 
void free_non_head_stock(
    struct ingredient *ingredient_in_question,
    struct ingredient *stock
);


////////////////////////////////////////////////////////////////////////
//              CSE Team's Helper Function Prototypes                 //
////////////////////////////////////////////////////////////////////////


// Prints a single order
void print_order(
    int num,
    char *customer,
    char *pizza_name,
    double price,
    int time_allowed
);

// Prints an ingredient given the name, amount and price in the required format.
void print_ingredient(char *name, int amount, double price);


////////////////////////////////////////////////////////////////////////
//                         Stage 1 Functions                          //
////////////////////////////////////////////////////////////////////////


struct pizzeria *create_pizzeria() {
    struct pizzeria *new = malloc(sizeof(struct pizzeria));

    new->orders = NULL;
    new->selected_order = NULL;
    new->stock = NULL;

    return new;
}

int add_order(
    struct pizzeria *pizzeria,
    char *customer,
    char *pizza_name,
    double price,
    int time_allowed
) {    
    if (add_order_validity(price, time_allowed) != VALID_ORDER) {
        return add_order_validity(price, time_allowed);
    }

    struct order *new_order = create_order(customer, pizza_name, price, 
                                           time_allowed, NULL, NULL, NULL);
    struct order *head_order = pizzeria->orders;
    
    pizzeria->orders = insert_order(new_order, head_order);
    
    return SUCCESS;
}

void print_all_orders(struct pizzeria *pizzeria) {    
    struct order *current_order = pizzeria->orders;
    int order_number = INITIAL_ORDER_NUMBER;
    
    while (current_order) {
        print_order(order_number, current_order->customer, 
                    current_order->pizza_name, current_order->price, 
                    current_order->time_allowed);
        
        order_number++;
        current_order = current_order->next;
    }

    print_selected_order(pizzeria);
    
    return;
}

int next_deadline(struct pizzeria *pizzeria) {    
    if (!pizzeria->orders) {
        return INVALID_CALL;
    }
    
    struct order *current_order = pizzeria->orders;
    int next_deadline = current_order->time_allowed;
    
    while (current_order) {
    
        if (current_order->time_allowed <= next_deadline) {
            next_deadline = current_order->time_allowed;
        }
        
        current_order = current_order->next;
    }

    return next_deadline;
}


////////////////////////////////////////////////////////////////////////
//                         Stage 2 Functions                          //
////////////////////////////////////////////////////////////////////////


void select_next_order(struct pizzeria *pizzeria) {    
    struct order *current_order = pizzeria->orders;
        
    if (!pizzeria->selected_order) {
        pizzeria->selected_order = current_order;
    } else {
        current_order = pizzeria->selected_order;
        pizzeria->selected_order = current_order->next;
    }
    
    return;
} 

void select_previous_order(struct pizzeria *pizzeria) {    
    struct order *current_order = pizzeria->orders;
    
    if (!pizzeria->selected_order) {
    
        while (current_order->next) {
            current_order = current_order->next;
        }
        
        pizzeria->selected_order = current_order;
    } else {
        current_order = pizzeria->selected_order;
        pizzeria->selected_order = current_order->previous;
    }

    return;
}

void print_selected_order(struct pizzeria *pizzeria) {
    if (!pizzeria->selected_order) {
        printf("\nNo selected order.\n");
    } else {
        printf("\nThe selected order is %s's %s Pizza ($%.2lf) due in %d "
               "minutes.\n", pizzeria->selected_order->customer, 
               pizzeria->selected_order->pizza_name, 
               pizzeria->selected_order->price, 
               pizzeria->selected_order->time_allowed);
               
        print_all_ingredients(pizzeria->selected_order->ingredients);
    }
    
}

int add_ingredient(
    struct pizzeria *pizzeria,
    char *ingredient_name,
    int amount,
    double price
) {
    if (add_ingredient_validity(pizzeria->selected_order, price, amount) 
                                                         != VALID_ORDER) {
        return add_ingredient_validity(pizzeria->selected_order, price, amount);
    }

    add_ingredient_ordered(pizzeria, ingredient_name, amount, price);
  
    return SUCCESS;
}

double calculate_total_profit(struct pizzeria *pizzeria) {
    if (!pizzeria->selected_order) {
        return INVALID_ORDER;
    }
    
    double ingredient_expenses = calculate_ingredient_expenses
                                 (pizzeria->selected_order->ingredients);
    double profit = pizzeria->selected_order->price - ingredient_expenses;

    return profit;
}


////////////////////////////////////////////////////////////////////////
//                         Stage 3 Functions                          //
////////////////////////////////////////////////////////////////////////


int cancel_order(struct pizzeria *pizzeria) {
    if (!pizzeria->selected_order) {
        return INVALID_ORDER;
    } 

    free_an_order(pizzeria);
   
    return SUCCESS;
}

void free_pizzeria(struct pizzeria *pizzeria) {
    free_all_orders(pizzeria->orders);
    free_ingredients(pizzeria->stock);
    free(pizzeria);

    return;
}

int refill_stock(
    struct pizzeria *pizzeria,
    char *ingredient_name,
    int amount,
    double price
) {
    if (refill_stock_validity(price, amount) != VALID_ORDER) {
        return refill_stock_validity(price, amount);
    }

    if (add_exisiting_ingredient(pizzeria->stock, ingredient_name, amount) 
                                                    == NO_SAME_INGREDIENT) {
        struct ingredient *new_ingredient = create_ingredient(ingredient_name, 
                                                          amount, price, NULL);
        struct ingredient *head_ingredient = pizzeria->stock;

        pizzeria->stock = insert_ingredient(new_ingredient, head_ingredient);
    }

    return SUCCESS;
}

void print_stock(struct pizzeria *pizzeria) {
    printf("The stock contains:\n");

    if (pizzeria->stock) {
        print_all_ingredients(pizzeria->stock);
    }

    return;
}

int can_complete_order(struct pizzeria *pizzeria) {
    if (!pizzeria->selected_order || !pizzeria->selected_order->ingredients) {
        return INVALID_ORDER;
    }

    struct ingredient *current_ingredient = 
           pizzeria->selected_order->ingredients;

    while (current_ingredient) {
    
        if (in_stock(pizzeria->stock, current_ingredient) 
                                   == INSUFFICIENT_STOCK) {
            return INSUFFICIENT_STOCK;
        }

        current_ingredient = current_ingredient->next;
    }

    return SUCCESS;
}


////////////////////////////////////////////////////////////////////////
//                         Stage 4 Functions                          //
////////////////////////////////////////////////////////////////////////


int complete_order(struct pizzeria *pizzeria) {
    if (can_complete_order(pizzeria) != SUCCESS) {
        return can_complete_order(pizzeria);
    }

    deduct_ingredient(pizzeria->selected_order->ingredients, pizzeria->stock);

    struct ingredient *current_stock = pizzeria->stock;
    struct ingredient *ingredient_in_question = NULL;

    while (current_stock) {
        ingredient_in_question = current_stock;
        current_stock = current_stock->next;

        if (!ingredient_in_question->amount) {
            free_zero_stock(ingredient_in_question, pizzeria->stock);
        }
    }

    free_an_order(pizzeria);

    return SUCCESS;
}

int save_ingredients(struct pizzeria *pizzeria, char *file_name) {
    if (!pizzeria->selected_order) {
        return INVALID_ORDER;
    }

    char ingredient_data[MAX_SAVE_LENGTH];
    char all_ingredients[MAX_SAVE_LENGTH] = EMPTY_STRING;

    struct ingredient *current_ingredient = 
           pizzeria->selected_order->ingredients;

    while (current_ingredient) {
        sprintf(ingredient_data, "%s %d %lf|", 
                current_ingredient->ingredient_name, current_ingredient->amount,
                current_ingredient->price);
        strcat(all_ingredients, ingredient_data);

        current_ingredient = current_ingredient->next;
    }

    save_string(file_name, all_ingredients);

    return SUCCESS;
}

int load_ingredients(struct pizzeria *pizzeria, char *file_name) {
    if (!pizzeria->selected_order) {
        return INVALID_ORDER;
    }

    char *all_ingredients;
    all_ingredients = load_string(file_name);
    
    char *next_data = NULL;
    char *ingredient_data = strtok_r(all_ingredients, INGREDIENT_SEPARATOR, 
                                                                &next_data);
    char ingredient_name[MAX_STR_LENGTH];
    int amount;
    double price;

    while (ingredient_data) {
        sscanf(ingredient_data, "%s %d %lf", ingredient_name, &amount, &price);
        add_ingredient_ordered(pizzeria, ingredient_name, amount, price);

        ingredient_data = strtok_r(NULL, INGREDIENT_SEPARATOR, &next_data);
    }

    free(all_ingredients);

    return SUCCESS;
}


////////////////////////////////////////////////////////////////////////
//                   HELPER FUNCTIONS - Shakira's                     //
////////////////////////////////////////////////////////////////////////


///////////////////////////////////
//       Stage 1 Functions       //
///////////////////////////////////

// checks whether or not an order's price and time is valid
//
// 'add_order_validity' will be given the parameters:
// - 'price' -- the price the customer is paying for the pizza
// - 'time_allowed' -- the time the customer will wait for the order
//
// 'add_order_validity' will return (in order of precedence):
// - 'INVALID_PRICE' -- if the price is a negative number
// - 'INVALID_TIME' -- if the time is not a non-zero positive integer
// - 'VALID_ORDER' -- otherwise
//
int add_order_validity(
    double price,
    int time_allowed
) {
    int add_order_status = VALID_ORDER;
    
    if (price < 0) {
        add_order_status = INVALID_PRICE;
    } else if (time_allowed <= 0) {
        add_order_status = INVALID_TIME;
    }
    
    return add_order_status;
}

// add the created order into the end of the linked list of orders
// 
// 'insert_order' will be given the parameters:
// - 'new_order' -- the order created
// - 'head_order' -- the head of the linked list of orders
// 
// 'insert_order' will return 'head_order'
//
struct order *insert_order(
    struct order *new_order,
    struct order *head_order
) {
    if (!head_order) {
        head_order = new_order;
    } else {
        struct order *current_order = head_order;
        
        while (current_order->next) {
            current_order = current_order->next;
        }
        
        current_order->next = new_order;
        new_order->previous = current_order;
    }

    return head_order;
}

// creates a new order to be added into linked list of orders
// 
// 'create_order' will be given the parameters:
// - 'customer' -- the name of the customer
// - 'pizza_name' -- the pizza that the customer ordered
// - 'price' -- the price the customer is paying for the pizza
// - 'time_allowed' -- the time the customer will wait for the order
// - 'new_next' -- the order after the order being created
// - 'new_previous' -- the order before the order being created
// - 'ingreient_list' -- the ingredients of the pizza ordered
// 
// 'create_order' will return:
// - 'new_order' -- the customer's order created
//
struct order *create_order(
    char *customer,
    char *pizza_name,
    double price,
    int time_allowed,
    struct order *new_next,
    struct order *new_previous,
    struct ingredient *ingredient_list
) {
    struct order *new_order = malloc(sizeof(struct order));
    
    strcpy(new_order->customer, customer);
    strcpy(new_order->pizza_name, pizza_name);
    new_order->price = price;
    new_order->time_allowed = time_allowed;
    new_order->next = new_next;
    new_order->previous = new_previous;
    new_order->ingredients = ingredient_list;
    
    return new_order;
}


///////////////////////////////////
//       Stage 2 Functions       //
///////////////////////////////////

// prints all the ingredients in the linked list of ingredients for the
// selected order
// 
// 'print_all_ingredients' will be given the parameter:
// - 'ingredients' -- the selected orders list of ingredients
// 
// 'print_all_ingredients' will not return anything
// 'print_all_ingredients' will not print anything if there are no ingredients
//
void print_all_ingredients(struct ingredient *ingredients) {
    if (ingredients) { 
        struct ingredient *current_ingredient = ingredients;

        while (current_ingredient) {
            print_ingredient(current_ingredient->ingredient_name,
                             current_ingredient->amount, 
                             current_ingredient->price);
            
            current_ingredient = current_ingredient->next;
        }
        
    }
}

// checks whether or not there is a selected order;
// if there is, it checks whether an ingredient's price and amount is valid
//
// 'add_ingredient_validity' will be given the parameters:
// - 'selected_order' -- the selected order to add ingredients to
// - 'price' -- the price of the ingredient (per amount)
// - 'amount' -- the amount of the ingredient required for the order
//
// 'add_order_validity' will return (in order of precedence):
// - 'INVALID_ORDER' -- if there is no selected order
// - 'INVALID_PRICE' -- if the price is a negative number
// - 'INVALID_AMOUNT' -- if the amount is not a non-zero positive integer
// - 'VALID_ORDER' -- otherwise
//
int add_ingredient_validity(
    struct order *selected_order,
    double price,
    int amount
) {
    int add_ingredient_status = VALID_ORDER;

    if (!selected_order) {
        add_ingredient_status = INVALID_ORDER;
    } else if (price < 0) {
        add_ingredient_status = INVALID_PRICE;
    } else if (amount <= 0) {
        add_ingredient_status = INVALID_AMOUNT;
    }

    return add_ingredient_status;
}

// adds the ingredient (new or existingg) into linked list of ingredients
// 
// 'add_ingredient_to_list' will be given the parameters:
// - 'pizzeria' -- the linked list of pizzeria
// - 'ingredient_name' -- the name of the ingredient
// - 'amount' -- the amount of the ingredient required for the order
// - 'price' -- the price of the ingredient (per amount)
// 
// 'add_ingredient_to_list' will not return anything
//
void add_ingredient_ordered(
    struct pizzeria *pizzeria,
    char *ingredient_name,
    int amount,
    double price
) {
    if (add_exisiting_ingredient(pizzeria->selected_order->ingredients, 
                        ingredient_name, amount) == NO_SAME_INGREDIENT) {
        struct ingredient *new_ingredient = create_ingredient (ingredient_name, 
                                                           amount, price, NULL);
        struct ingredient *head_ingredient = 
               pizzeria->selected_order->ingredients;

        pizzeria->selected_order->ingredients = insert_ingredient
                                (new_ingredient, head_ingredient);
    }
}

// checks if the ingredient is in the linked list of ingredients;
// if it is, it adds amount into the exisiting ingredient's amount
//
// 'add_exisiting_ingredient' will be given the parameters:
// - 'ingredients' -- the linked list of ingredients of the selected order
// - 'ingredient_name' -- the name of the ingredient
// - 'amount' -- the amount of the ingredient required for the order
//
// 'add_exisiting_ingredient' will return:
// - 'SAME_INGREDIENT' -- if there is an existing ingredient
// - 'NO_SAME_INGREDIENT' -- otherwise
//
int add_exisiting_ingredient(
    struct ingredient *ingredients,
    char *ingredient_name,
    int amount
) {
    struct ingredient *current_ingredient = ingredients;

    while (current_ingredient) {
    
        if (!strcmp(ingredient_name, current_ingredient->ingredient_name)) {
            current_ingredient->amount += amount;
            
            return SAME_INGREDIENT;
        }
        
        current_ingredient = current_ingredient->next;
    }

    return NO_SAME_INGREDIENT;
}

// creates a new order to be added into linked list of orders
// 
// 'create_order' will be given the parameters:
// - 'ingredient_name' -- the name of the ingredient
// - 'amount' -- the amount of the ingredient required for the order
// - 'price' -- the price of the ingredient (per amount)
// - 'new_next' -- the order after the order being created
// 
// 'create_order' will return:
// - 'new_ingredient' -- the ingredient created
//
struct ingredient *create_ingredient(
    char *ingredient_name,
    int amount,
    double price,
    struct ingredient *new_next
) {
    struct ingredient *new_ingredient = malloc(sizeof(struct ingredient));
    
    strcpy(new_ingredient->ingredient_name, ingredient_name);
    new_ingredient->amount = amount;
    new_ingredient->price = price;
    new_ingredient->next = new_next;

    return new_ingredient;
}

// inserts the created ingredient alphabetically into linked list of ingredients
// 
// 'insert_ingredient' will be given the parameters:
// - 'new_ingredient' -- the ingredient created
// - 'head_ingredient' -- the head of the linked list of ingredients
// 
// 'insert_ingredient' will return 'head_ingredient'
//
struct ingredient *insert_ingredient(
    struct ingredient *new_ingredient, 
    struct ingredient *head_ingredient
) {
    struct ingredient *current_ingredient = head_ingredient;
    
    if (!head_ingredient) {
        head_ingredient = new_ingredient;
    } else if (strcmp(current_ingredient->ingredient_name, 
                      new_ingredient->ingredient_name) > 0 ) {
        head_ingredient = new_ingredient;
        new_ingredient->next = current_ingredient;
    } else {
    
        while (current_ingredient->next && 
               strcmp(current_ingredient->next->ingredient_name, 
                      new_ingredient->ingredient_name) < 0) {
            current_ingredient = current_ingredient->next;
        }
        
        new_ingredient->next = current_ingredient->next;
        current_ingredient->next = new_ingredient;
    }
    
    return head_ingredient;
}

// calculates the total expense for all the ingredients in the selected order
// 
// 'calculate_ingredient_expenses' will be given the parameters:
// - 'ingredients' -- the linked list of ingredients of a selected order
// 
// 'calculate_ingredient_expenses' will return:
// - 'total_ingredient_expenses' -- total ingredient expenses of an order
//
double calculate_ingredient_expenses(struct ingredient *ingredients) {
    struct ingredient *current_ingredient = ingredients;
    double total_ingredient_expenses = INITIAL_INGREDIENT_EXPENSES;
    
    while (current_ingredient) {
        total_ingredient_expenses += current_ingredient->amount * 
                                     current_ingredient->price;
        
        current_ingredient = current_ingredient->next;
    }
    
    return total_ingredient_expenses;
}


///////////////////////////////////
//       Stage 3 Functions       //
///////////////////////////////////

// frees all associated memory of the selected order
// 
// 'free_an_order' will be given the parameters:
// - 'pizzeria' -- the linked list of pizzeria
// 
// 'free_an_order' will not return anything
//
void free_an_order(struct pizzeria *pizzeria) {
    if (pizzeria->orders == pizzeria->selected_order) {
        free_head_order(pizzeria);
    } else {
        free_non_head_orders(pizzeria);
    }
}

// frees all associated memory of the head in the linked list of orders
// 
// 'free_head_order' will be given the parameters:
// - 'pizzeria' -- the linked list of pizzeria
// 
// 'free_head_order' will not return anything
//
void free_head_order(struct pizzeria *pizzeria) {
    struct order *new_head_order = pizzeria->orders->next;
    
    if (new_head_order) {
        new_head_order->previous = pizzeria->orders->previous;
    }

    free_ingredients(pizzeria->selected_order->ingredients);
    pizzeria->selected_order = pizzeria->orders->next;
    free(pizzeria->orders);
    pizzeria->orders = new_head_order;
}

// frees all associated memory of the non-head in the linked list of orders 
// 
// 'free_non_head_orders' will be given the parameters:
// - 'pizzeria' -- the linked list of pizzeria
// 
// 'free_non_head_orders' will not return anything
//
void free_non_head_orders(struct pizzeria *pizzeria) {
    struct order *current_order = pizzeria->orders;

    while (current_order->next != pizzeria->selected_order) {
        current_order = current_order->next;
    }

    struct order *new_next_order = current_order->next->next;
    
    if (new_next_order) {
        new_next_order->previous = current_order->next->previous;
    }

    free_ingredients(pizzeria->selected_order->ingredients);
    pizzeria->selected_order = current_order->next->next;
    free(current_order->next);
    current_order->next = new_next_order;
}

// frees all associated memory of all the ingredients of a selected order
// 
// 'free_ingredients' will be given the parameters:
// - 'ingredients' -- the linked list of ingredients of the selected order
// 
// 'free_ingredients' will not return anything
//
void free_ingredients(struct ingredient *ingredients) {
    struct ingredient *current_ingredient = ingredients;
    struct ingredient *temp = NULL;

    while (current_ingredient) {
        temp = current_ingredient;
        current_ingredient = current_ingredient->next;
        free(temp);
    }
}

// frees all associated memory of all the orders
// 
// 'free_all_orders' will be given the parameters:
// - 'orders' -- the linked list of orders
// 
// 'free_all_orders' will not return anything
//
void free_all_orders(struct order *orders) {
    struct order *current_order = orders;

    while (current_order) {
        struct order *next_order = current_order->next;

        free_ingredients(current_order->ingredients);
        free(current_order);
        current_order = next_order;
    }
}

// checks whether or not stock's price and amount is valid
//
// 'refill_stock_validity' will be given the parameters:
// - 'price' -- the price the ingredient (per amount)
// - 'amount' -- the time the customer will wait for the order
//
// 'refill_stock_validity' will return (in order of precedence):
// - 'INVALID_PRICE' -- if the price is a negative number
// - 'INVALID_AMOUNT' -- if the time is not a non-zero positive integer
// - 'VALID_ORDER' -- otherwise
//
int refill_stock_validity(
    double price,
    int amount
) {
    int refill_stock_status = VALID_ORDER;

    if (price < 0) {
        refill_stock_status = INVALID_PRICE;
    } else if (amount <= 0) {
        refill_stock_status = INVALID_AMOUNT;
    }

    return refill_stock_status;
}

// checks whether or not an ingredient is in stock
//
// 'in_stock' will be given the parameters:
// - 'stock' -- the linked list of stock
// - 'current_ingredient' -- the ingredient being checked for stock
//
// 'in_stock' will return:
// - 'SUFFICIENT_STOCK' -- if there is a sufficient amount of stock for the
// amount of ingredient required for the order
// - 'INSUFFICIENT_STOCK' -- otherwise
//
int in_stock(
    struct ingredient *stock,
    struct ingredient *current_ingredient
) {    
    struct ingredient *current_stock = stock;

    while (current_stock) {
    
        if (!strcmp(current_ingredient->ingredient_name, 
                    current_stock->ingredient_name)) {
            return stock_status(current_stock->amount, 
                                current_ingredient->amount);
        }

        current_stock = current_stock->next;
    }

    if (!current_stock) {
        return INSUFFICIENT_STOCK;
    }

    return SUFFICIENT_STOCK;
}

// checks whether or not an there is sufficient stock for a certain ingredient
//
// 'stock_status' will be given the parameters:
// - 'stock_amount' -- the amount in stock for the ingredient in question
// - 'ingredient_amount' -- the amount of ingredient required for the order
//
// 'stock_status' will return:
// - 'SUFFICIENT_STOCK' -- if there is a sufficient amount of stock for the
// amount of ingredient required for the order
// - 'INSUFFICIENT_STOCK' -- otherwise
//
int stock_status(
    int stock_amount,
    int ingredient_amount
) {
    if (stock_amount < ingredient_amount) {
        return INSUFFICIENT_STOCK;
    } 
    
    return SUFFICIENT_STOCK;
}


///////////////////////////////////
//       Stage 4 Functions       //
///////////////////////////////////

// deducts the ingredient's order amount from the ingredient's stock amount
// 
// 'deduct_ingredient' will be given the parameters:
// - 'ingredients' -- the linked list of ingredients
// - 'stock' -- the linked list of stock
// deducted from its stock amount 
// 
// 'deduct_ingredient' will not return anything
//
void deduct_ingredient(
    struct ingredient *ingredients,
    struct ingredient *stock
) {
    struct ingredient *current_ingredient = ingredients;

    while (current_ingredient) {
        deduct_from_stock(stock, current_ingredient);

        current_ingredient = current_ingredient->next;
    }
}

// performs the reduction of the stock amount of the selected ingredient
// 
// 'deduct_from_stock' will be given the parameters:
// - 'stock' -- the linked list of stock
// - 'current_ingredient' -- the ingredient in which its order amount is to be 
// deducted from its stock amount 
// 
// 'deduct_from_stock' will not return anything
//
void deduct_from_stock(
    struct ingredient *stock,
    struct ingredient *current_ingredient
) {
    struct ingredient *current_stock = stock;

    while (current_stock) {
    
        if (!strcmp(current_stock->ingredient_name, 
                    current_ingredient->ingredient_name)) {
            current_stock->amount -= current_ingredient->amount;
        }

        current_stock = current_stock->next;
    }
}

// frees all associated memory of the the ingredient with no stock left
// 
// 'free_zero_stock' will be given the parameters:
// - 'ingredient_in_question' -- the ingredient being checked for stock amount
// - 'stock' -- the linked list of stock
// 
// 'free_zero_stock' will not return anything
//
void free_zero_stock(
    struct ingredient *ingredient_in_question,
    struct ingredient *stock
) {
    if (stock == ingredient_in_question) {
        free_head_stock(ingredient_in_question, stock);
    } else {
        free_non_head_stock(ingredient_in_question, stock);
    }
}

// frees all associated memory of the head in the linked list of stock
// 
// 'free_head_stock' will be given the parameters:
// - 'ingredient_in_question' -- the ingredient being checked for stock amount
// - 'stock' -- the linked list of stock
// 
// 'free_head_stock' will not return anything
//
void free_head_stock(
    struct ingredient *ingredient_in_question,
    struct ingredient *stock
) {
    struct ingredient *new_head_stock = ingredient_in_question->next;

    free(ingredient_in_question);
    stock = new_head_stock;
}

// frees all associated memory of the non-head in the linked list of stock 
// 
// 'free_non_head_stock' will be given the parameters:
// - 'ingredient_in_question' -- the ingredient being checked for stock amount
// - 'stock' -- the linked list of stock
// 
// 'free_non_head_stock' will not return anything
//
void free_non_head_stock(
    struct ingredient *ingredient_in_question,
    struct ingredient *stock
) {
    struct ingredient *current_ingredient = stock;

    while (current_ingredient && 
           current_ingredient->next != ingredient_in_question) {
        current_ingredient = current_ingredient->next;
    }

    struct ingredient *new_next_stock = current_ingredient->next->next;

    free(current_ingredient->next);
    current_ingredient->next = new_next_stock;
}


////////////////////////////////////////////////////////////////////////
//                   HELPER FUNCTIONS - CSE Team's                    //
////////////////////////////////////////////////////////////////////////


// Prints a single order
//
// `print_order` will be given the parameters:
// - `num` -- the integer that represents which order it is sequentially.
// - `customer` -- the name of the customer for that order.
// - `pizza_name` -- the pizza the customer ordered.
// - `price` -- the price the customer is paying for the pizza.
// - `time_allowed` -- the time the customer will wait for the order.
//
// `print_order` assumes all parameters are valid.
//
// `print_order` returns nothing.
//
// This will be needed for Stage 1.
void print_order(
    int num,
    char *customer,
    char *pizza_name,
    double price,
    int time_allowed
) {
    printf("%02d: %s ordered a %s pizza ($%.2lf) due in %d minutes.\n",
           num, customer, pizza_name, price, time_allowed);

    return;
}

// Prints a single ingredient
//
// `print_ingredient` will be given the parameters:
// - `name` -- the string which contains the ingredient's name.
// - `amount` -- how many of the ingredient we either need or have.
// - `price` -- the price the ingredient costs.
//
// `print_ingredient` assumes all parameters are valid.
//
// `print_ingredient` returns nothing.
//
// This will be needed for Stage 2.
void print_ingredient(char *name, int amount, double price) {
    printf("    %s: %d @ $%.2lf\n", name, amount, price);
}
