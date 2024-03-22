//
// COMP1521 Laboratory 10 - Fix a data race
//
// FIX: make perform_increment function thread-safe to call
//
// Authors:
// Shakira Li (z5339356@unsw.edu.au)
//
//
//
// Written: 22/11/2022
//

//! fix the data race in the below program!


/// You are permitted to add standard headers (useful for atomics)
#include <pthread.h>
#include <stdatomic.h>

/// You are permitted to modify the type of
/// this global variable (useful for atomics)
atomic_int global_counter = 0;

/// You are permitted to create another global
/// variable (useful for mutex)


/// You are permitted to modify this function
/// (will be necessary for both mutex and atomics)
void perform_increment(void) {
    global_counter += 1;
}


///
/// DO NOT CHANGE ANY CODE BELOW THIS POINT
///

void *thread_run(void *data) {
    int n_increments = * (int *) data;

    for (int i = 0; i < n_increments; i++) {
        perform_increment();
    }

    return NULL;
}


int get_global_counter(void) {
    return global_counter;
}
