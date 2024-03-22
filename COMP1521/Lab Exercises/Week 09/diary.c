//
// COMP1521 Laboratory 09 - Append to a Diary File
//
// appends 1 line to $HOME/.diary
//
// Authors:
// Shakira Li (z5339356@unsw.edu.au)
//
//
//
// Written: 10/11/2022
//

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    char *home = getenv("HOME");
    if (!home) home = ".";

    char *diary_name = ".diary";
    char diary[strlen(home) + strlen(diary_name) + 2];
    snprintf(diary, sizeof diary, "%s/%s", home, diary_name);

    FILE *stream = fopen(diary, "a");
    if (stream == NULL) {
        perror(diary);
        return 1;
    }

    for (int i = 1; i < argc; i++) {
        fprintf(stream, "%s", argv[i]);
        if (i < argc - 1) {
            fprintf(stream, " ");
        }
    }

    fprintf(stream, "\n");
    fclose(stream);

    return 0;
}