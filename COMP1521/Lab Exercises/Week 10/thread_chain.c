//
// COMP1521 Laboratory 10 - Create a chain of threads
//
// spawns a new thread: my_thread, which calls a provided function 
// thread_hello() before terminating
//
// Authors:
// Shakira Li (z5339356@unsw.edu.au)
//
//
//
// Written: 22/11/2022
//

#include <pthread.h>
#include "thread_chain.h"

void *my_thread(void *data) {
    int more_threads = * (int *) data;
    thread_hello();
    if (more_threads > 0) { 
        more_threads--;
        pthread_t thread;
        pthread_create(&thread, NULL, my_thread, &more_threads); 
        pthread_join(thread, NULL);
    }

    return NULL; 
}

void my_main(void) {
    int more_threads = 49;
    pthread_t thread_handle;
    pthread_create(&thread_handle, NULL, my_thread, &more_threads);
    pthread_join(thread_handle, NULL);
}