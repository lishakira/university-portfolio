########################################################################
# COMP1521 22T3 -- Assignment 1 -- Battlesmips!
#
#
# !!! IMPORTANT !!!
# Before starting work on the assignment, make sure you set your tab-width to 8!
# It is also suggested to indent with tabs only.
# Instructions to configure your text editor can be found here:
#   https://cgi.cse.unsw.edu.au/~cs1521/22T3/resources/mips-editors.html
# !!! IMPORTANT !!!
#
# A simplified implementation of the classic board game battleship!
# This program was written by Shakira Li (z5339356)
# on 24/10/2022
#
# Version 1.0 (2022/10/04): Team COMP1521 <cs1521@cse.unsw.edu.au>
#
################################################################################

#![tabsize(8)]

# Constant definitions.
# DO NOT CHANGE THESE DEFINITIONS

# True and False constants
TRUE			= 1
FALSE			= 0
INVALID			= -1

# Board dimensions
BOARD_SIZE		= 7

# Bomb cell types
EMPTY			= '-'
HIT			= 'X'
MISS			= 'O'

# Ship cell types
CARRIER_SYMBOL		= 'C'
BATTLESHIP_SYMBOL	= 'B'
DESTROYER_SYMBOL	= 'D'
SUBMARINE_SYMBOL	= 'S'
PATROL_BOAT_SYMBOL	= 'P'

# Ship lengths
CARRIER_LEN		= 5
BATTLESHIP_LEN		= 4
DESTROYER_LEN		= 3
SUBMARINE_LEN		= 3
PATROL_BOAT_LEN		= 2

# Players
BLUE			= 'B'
RED			= 'R'

# Direction inputs
UP			= 'U'
DOWN			= 'D'
LEFT			= 'L'
RIGHT			= 'R'

# Winners
WINNER_NONE		= 0
WINNER_RED		= 1
WINNER_BLUE		= 2


################################################################################
# DATA SEGMENT
# DO NOT CHANGE THESE DEFINITIONS
.data

# char blue_board[BOARD_SIZE][BOARD_SIZE];
blue_board:			.space  BOARD_SIZE * BOARD_SIZE

# char red_board[BOARD_SIZE][BOARD_SIZE];
red_board:			.space  BOARD_SIZE * BOARD_SIZE

# char blue_view[BOARD_SIZE][BOARD_SIZE];
blue_view:			.space  BOARD_SIZE * BOARD_SIZE

# char red_view[BOARD_SIZE][BOARD_SIZE];
red_view:			.space  BOARD_SIZE * BOARD_SIZE

# char whose_turn = BLUE;
whose_turn:			.byte   BLUE

# point_t target;
.align 2
target:						# struct point target {
				.space  4	# 	int row;
				.space  4	# 	int col;
						# }

# point_t start;
.align 2
start:						# struct point start {
				.space  4	# 	int row;
				.space  4	# 	int col;
						# }

# point_t end;
.align 2
end:						# struct point end {
				.space  4	# 	int row;
				.space  4	# 	int col;
						# }

# Strings
red_player_name_str:		.asciiz "RED"
blue_player_name_str:		.asciiz "BLUE"
place_ships_str:		.asciiz ", place your ships!\n"
your_final_board_str:		.asciiz ", Your final board looks like:\n\n"
red_wins_str:			.asciiz "RED wins!\n"
blue_wins_str:			.asciiz "BLUE wins!\n"
red_turn_str:			.asciiz "It is RED's turn!\n"
blue_turn_str:			.asciiz "It is BLUE's turn!\n"
your_curr_board_str:		.asciiz "Your current board:\n"
ship_input_info_1_str:		.asciiz "Placing ship type "
ship_input_info_2_str:		.asciiz ", with length "
ship_input_info_3_str:		.asciiz ".\n"
enter_start_row_str:		.asciiz "Enter starting row: "
enter_start_col_str:		.asciiz "Enter starting column: "
enter_direction_str:		.asciiz "Enter direction (U, D, L, R): "
invalid_direction_str:		.asciiz "Invalid direction. Try again.\n"
invalid_length_str:		.asciiz "Ship doesn't fit in this direction. Try again.\n"
invalid_overlaps_str:		.asciiz "Ship overlaps with another ship. Try again.\n"
invalid_coords_already_hit_str:	.asciiz "You've already hit this target. Try again.\n"
invalid_coords_out_bounds_str:	.asciiz "Coordinates out of bounds. Try again.\n"
enter_row_target_str:		.asciiz "Please enter the row for your target: "
enter_col_target_str:		.asciiz "Please enter the column for your target: "
hit_successful_str: 		.asciiz "Successful hit!\n"
you_missed_str:			.asciiz "Miss!\n"


############################################################
####                                                    ####
####   Your journey begins here, intrepid adventurer!   ####
####                                                    ####
############################################################


################################################################################
#
# Implement the following functions,
# and check these boxes as you finish implementing each function.
#
#  - [X] main
#  - [X] initialise_boards
#  - [X] initialise_board
#  - [X] setup_boards
#  - [X] setup_board
#  - [X] place_ship
#  - [X] is_coord_out_of_bounds
#  - [X] is_overlapping
#  - [X] place_ship_on_board
#  - [X] play_game
#  - [X] play_turn
#  - [X] perform_hit
#  - [X] check_player_win
#  - [X] check_winner
#  - [X] print_board			(provided for you)
#  - [X] swap_turn			(provided for you)
#  - [X] get_end_row			(provided for you)
#  - [X] get_end_col			(provided for you)
################################################################################

################################################################################
# .TEXT <main>
.text
main:
	# Args:     void
	#
	# Returns:
	#   - $v0: int
	#
	# Frame:    [$ra]
	# Uses:     [$v0]
	# Clobbers: [$v0]
	#
	# Locals:
	#
	# Structure:
	#   main
	#   -> [prologue]
	#   -> body
	#   -> [epilogue]

main__prologue:
	begin			# begin a new stack frame
	push	$ra		# | $ra

main__body:
	jal	initialise_boards
	jal	setup_boards
	jal	play_game

main__epilogue:
	pop	$ra		# | $ra
	end			# ends the current stack frame

	li	$v0, 0
	jr	$ra		# return 0;


################################################################################
# .TEXT <initialise_boards>
.text
initialise_boards:
	# Args:     void
	#
	# Returns:  void
	#
	# Frame:    [$ra]
	# Uses:     [$a0]
	# Clobbers: [$a0]
	#
	# Locals:
	#
	# Structure:
	#   initialise_boards
	#   -> [prologue]
	#   -> body
	#   -> [epilogue]

initialise_boards__prologue:
	begin 
	push	$ra

initialise_boards__body:
	la	$a0, blue_board		
	jal	initialise_board		# initialise_board(blue_board);

	la	$a0, blue_view
	jal	initialise_board		# initialise_board(blue_view);

	la	$a0, red_board
	jal	initialise_board		# initialise_board(red_board);

	la	$a0, red_view
	jal	initialise_board		# initialise_board(red_view);

initialise_boards__epilogue:
	pop	$ra
	end

	jr	$ra		# return;


################################################################################
# .TEXT <initialise_board>
.text
initialise_board:
	# Args:
        #   - $a0: char[BOARD_SIZE][BOARD_SIZE] board
	#
	# Returns:  void
	#
	# Frame:    []
	# Uses:     [$t0, $t1, $t2, $t3, $t4]
	# Clobbers: [$t0, $t1, $t2, $t3, $t4]
	#
	# Locals:
	#   - $t0: int row
	#   - $t1: int col
	#   - $t2: board[row][col]
	#   - $t3: temporary result
	#   - $t4: EMPTY
	#
	# Structure:
	#   initialise_board
	#   -> [prologue]
	#   -> body
	#	-> row_init
	#	-> row_cond
	#	-> col_init
	#	-> col_cond
	#	-> col_step
	#	-> row_step
	#   -> [epilogue]

initialise_board__prologue:

initialise_board__body:

initialise_board__row_init:
	li	$t0, 0						# int row = 0;

initialise_board__row_cond:
	bge	$t0, BOARD_SIZE, initialise_board__epilogue	# if row < BOARD_SIZE

initialise_board__col_init:
	li	$t1, 0						# int col = 0;

initialise_board__col_cond:
	bge	$t1, BOARD_SIZE, initialise_board__row_step	# if col < BOARD_SIZE

	move	$t2, $a0					# board[0][0]
	mul	$t3, $t0, BOARD_SIZE				# calculate &board[row][col]
	add	$t3, $t3, $t1
	add	$t2, $t2, $t3

	li	$t4, EMPTY
	sb	$t4, ($t2)					# board[row][col] = EMPTY

initialise_board__col_step:
	addi	$t1, $t1, 1					# col++;
	b	initialise_board__col_cond

initialise_board__row_step:
	addi	$t0, $t0, 1					# row++;
	b 	initialise_board__row_cond	

initialise_board__epilogue:
	jr	$ra						# return;


################################################################################
# .TEXT <setup_boards>
.text
setup_boards:
	# Args:     void
	#
	# Returns:  void
	#
	# Frame:    [$ra]
	# Uses:     [$a0, $a1]
	# Clobbers: [$a0, $a1]
	#
	# Locals:
	#
	# Structure:
	#   setup_boards
	#   -> [prologue]
	#   -> body
	#   -> [epilogue]

setup_boards__prologue:
	begin
	push	$ra

setup_boards__body:
 	la	$a0, blue_board
	la	$a1, blue_player_name_str
	jal	setup_board			# setup_board(blue_board, "BLUE");

	la	$a0, red_board
	la	$a1, red_player_name_str
	jal	setup_board			# setup_board(red_board,  "RED");

setup_boards__epilogue:
	pop	$ra
	end

	jr	$ra				# return;


################################################################################
# .TEXT <setup_board>
.text
setup_board:
	# Args:
	#   - $a0: char[BOARD_SIZE][BOARD_SIZE] board
	#   - $a1: char *player
	#
	# Returns:  void
	#
	# Frame:    [$ra, $s0, $s1]
	# Uses:     [$a0, $a1, $a2, $s0, $s1]
	# Clobbers: [$a0, $a1, $a2]
	#
	# Locals:
	#   - $s0: saved $a0
	#   - $s1: saved $a1
	#
	# Structure:
	#   setup_board
	#   -> [prologue]
	#   -> body
	#	-> print_ships
	#	-> place_ships
	#	-> print_board
	#   -> [epilogue]

setup_board__prologue:
	begin
	push	$ra
	push	$s0
	push	$s1
	move	$s0, $a0
	move	$s1, $a1

setup_board__body:

setup_board__print_ships:
	move	$a0, $s1
	li	$v0, 4				# printf("%s", player);
	syscall

	li	$v0, 4
	la	$a0, place_ships_str		# printf(", place your ships!\n");
	syscall

setup_board__place_ships:
	move	$a0, $s0
	la	$a1, CARRIER_LEN
	la	$a2, CARRIER_SYMBOL
	jal	place_ship			# place_ship(board, CARRIER_LEN, CARRIER_SYMBOL);

	move	$a0, $s0
	la	$a1, BATTLESHIP_LEN
	la	$a2, BATTLESHIP_SYMBOL
	jal	place_ship			# place_ship(board, BATTLESHIP_LEN, BATTLESHIP_SYMBOL);

	move	$a0, $s0
	la	$a1, DESTROYER_LEN
	la	$a2, DESTROYER_SYMBOL
	jal	place_ship			# place_ship(board, DESTROYER_LEN, DESTROYER_SYMBOL);

	move	$a0, $s0
	la	$a1, SUBMARINE_LEN
	la	$a2, SUBMARINE_SYMBOL
	jal	place_ship			# place_ship(board, SUBMARINE_LEN, SUBMARINE_SYMBOL);

	move	$a0, $s0
	la	$a1, PATROL_BOAT_LEN
	la	$a2, PATROL_BOAT_SYMBOL
	jal	place_ship			# place_ship(board, PATROL_BOAT_LEN, PATROL_BOAT_SYMBOL);

setup_board__print_board:
	move	$a0, $s1
	li	$v0, 4				# printf("%s", player);
	syscall

	li	$v0, 4
	la	$a0, your_final_board_str	# printf("Your final board looks like:\n");
	syscall

	move	$a0, $s0
	jal	print_board			# print_board(board);

setup_board__epilogue:
	pop	$s0
	pop	$s1
	pop	$ra
	end

	jr	$ra				# return;


################################################################################
# .TEXT <place_ship>
.text
place_ship:
	# Args:
	#   - $a0: char[BOARD_SIZE][BOARD_SIZE] board
	#   - $a1: int  ship_len
	#   - $a2: char ship_type
	#
	# Returns:  void
	#
	# Frame:    [$ra, $s0, $s1, $s2, $s3]
	# Uses:     [$s0, $s1, $s2, $s3, $t0, $t1,$a0, $a1, $a2]
	# Clobbers: [$t0, $t1, $a0, $a1, $a2]
	#
	# Locals:
	#   - $s0: saved $a0
	#   - $s1: saved $a1 
	#   - $s2: saved $a2
	#   - $s3: saved &direction_char
	#   - $t0: temporary result
	#   - $t1: temporary result
	#
	# Structure:
	#   place_ship
	#   -> [prologue]
	#   -> body
	#	-> for_loop
	#	   -> print_board
	#	   -> print_type_length
	#	   -> start_row
	#	   -> start_col
	#	   -> if_out_of_bounds_start
	#	   -> if_print_out_of_bounds_start
	#	   -> direction
	#	   -> calculate_end_row
	#	   -> calculate_end_col
	#	   -> if_invalid
	#	   -> if_invalid_or
	#	   -> print_invalid
	#	   -> if_out_of_bounds_end
	#	   -> if_print_out_of_bounds_end
	#	   -> face_up
	#	   -> body_up
	#	   -> face_left
	#	   -> body_left
	#	   -> if_overlapping
	#	   -> print_overlap
	#	-> valid
	#   -> [epilogue]

place_ship__prologue:
	begin
	push	$ra
	push	$s0
	push	$s1
	push	$s2
	move	$s0, $a0				# &board
	move	$s1, $a1				# &ship_len
	move	$s2, $a2				# &ship_type

place_ship__body:

place_ship__for_loop:

place_ship__print_board:
	li	$v0, 4					# printf("Your current board:\n");
	la	$a0, your_curr_board_str
	syscall

	move	$a0, $s0				# print_board(board);
	jal	print_board

place_ship__print_type_length:
	li	$v0, 4
	la	$a0, ship_input_info_1_str		# printf("Placing ship type ");
	syscall  

	move	$a0, $s2				# printf("%c", ship_type);
	li	$v0, 11
	syscall

	li	$v0, 4					# printf(", with length ");
	la	$a0, ship_input_info_2_str
	syscall

	move	$a0, $s1				# printf("%d", ship_len);
	li	$v0, 1
	syscall

	li	$v0, 4					# printf(".\n");
	la	$a0, ship_input_info_3_str
	syscall

place_ship__start_row: 
	la	$t0, start				# &start

	li	$v0, 4					# printf("Enter starting row: ");
	la	$a0, enter_start_row_str
	syscall

	li	$v0, 5					# scanf("%d", &start.row);
	syscall
	sw	$v0, ($t0)

place_ship__start_col:
	li	$v0, 4					# printf("Enter starting column: ");
	la	$a0, enter_start_col_str
	syscall

	li	$v0, 5					# scanf("%d", &start.col);
	syscall
	sw	$v0, 4($t0)

place_ship__if_out_of_bounds_start:
	move	$a0, $t0				# is_coord_out_of_bounds(&start)
	jal	is_coord_out_of_bounds
	move	$t0, $v0

	beqz	$t0, place_ship__direction		# if (is_coord_out_of_bounds(&start))

place_ship__if_print_out_of_bounds_start:
	li	$v0, 4					# printf("Coordinates out of bounds. Try again.\n");
	la	$a0, invalid_coords_out_bounds_str
	syscall

	b 	place_ship__for_loop

place_ship__direction:
	li	$v0, 4					# printf("Enter direction (U, D, L, R): ");
	la	$a0, enter_direction_str
	syscall

	li	$v0, 12					# scanf(" %c", &direction_char);
	syscall
	move	$s3, $v0				# &direction_char

place_ship__calculate_end_row:
	la	$t0, start				# &start
	la	$t1, end				# &end

	lw	$a0, ($t0)				# get_end_row(start.row, direction_char, ship_len);
	move	$a1, $s3
	move	$a2, $s1
	jal	get_end_row
	sw	$v0, ($t1)				# end.row = get_end_row(start.row, direction_char, ship_len);

place_ship__calculate_end_col:
	la	$t0, start				# &start
	la	$t1, end				# &end

	lw	$a0, 4($t0)				# get_end_col(start.col, direction_char, ship_len);
	move	$a1, $s3
	move	$a2, $s1
	jal	get_end_col
	sw	$v0, 4($t1)				# end.col = get_end_col(start.col, direction_char, ship_len);

place_ship__if_invalid:
	la	$t0, end

	lw	$t1, ($t0)
	bne	$t1, INVALID, place_ship__if_invalid_or		# if (end.row == INVALID)
	b 	place_ship__if_print_invalid

place_ship__if_invalid_or:
	lw	$t1, 4($t0)
	bne	$t1, INVALID, place_ship__if_out_of_bounds_end	# if (end.col == INVALID)

place_ship__if_print_invalid:
	li	$v0, 4					# printf("Invalid direction. Try again.\n");
	la 	$a0, invalid_direction_str
	syscall

	b	place_ship__for_loop

place_ship__if_out_of_bounds_end:
	la	$t0, end

	move	$a0, $t0				# is_coord_out_of_bounds(&end)
	jal	is_coord_out_of_bounds
	move	$t0, $v0

	beqz	$t0, place_ship__if_face_up		# if (is_coord_out_of_bounds(&end))

place_ship__if_print_out_of_bounds_end:
	li	$v0, 4					# printf("Ship doesn't fit in this direction. Try again.\n");
	la 	$a0, invalid_length_str
	syscall

	b	place_ship__for_loop	

place_ship__if_face_up:	
	la	$t0, start				# &start	
	la	$t1, end				# &end

	lw	$t2, ($t0)
	lw	$t3, ($t1)		
	ble	$t2, $t3, place_ship__if_face_left	# if (start.row > end.row)

place_ship__if_body_up:
	move	$t4, $t2				# int temp = start.row;
	sw	$t3, ($t0)				# start.row = end.row;
	sw	$t4, ($t1)				# end.row = temp;

place_ship__if_face_left:
	lw	$t2, 4($t0)
	lw	$t3, 4($t1)
	ble	$t2, $t3, place_ship__valid	# if (start.col > end.col)

place_ship__if_body_left:
	move	$t4, $t2				# int temp = start.col;
	sw	$t3, 4($t0)				# start.col = end.col;
	sw	$t4, 4($t1)				# end.col = temp;

place_ship__if_overlapping:
	move	$a0, $s0				# is_overlapping(board)
	jal	is_overlapping
	move	$t0, $v0
	
	beqz	$t0, place_ship__valid			# if (!is_overlapping(board))

place_ship__print_overlap:
	li	$v0, 4					# printf("Ship overlaps with another ship. Try again.\n");
	la	$a0, invalid_overlaps_str
	syscall

	b 	place_ship__for_loop

place_ship__valid:
	move	$a0, $s0				# place_ship_on_board(board, ship_type);
	move	$a1, $s2
	jal	place_ship_on_board

place_ship__epilogue:
	pop	$s2
	pop	$s1
	pop	$s0
	pop	$ra
	end

	jr	$ra		# return;


################################################################################
# .TEXT <is_coord_out_of_bounds>
.text
is_coord_out_of_bounds:
	# Args:
	#   - $a0: point_t *coord
	#
	# Returns:
	#   - $v0: bool
	#
	# Frame:    []
	# Uses:     [$t0, $t1, $t2, $v0]
	# Clobbers: [$t0, $t1, $t2, $v0]
	#
	# Locals:
	#   - $t0: &coord
	#   - $t1: coord->row
	#   - $t2: coord->col
	#   - $v0: TRUE | FALSE
	#
	# Structure:
	#   is_coord_out_of_bounds
	#   -> [prologue]
	#   -> body
	#	-> row_cond
	#	-> row_cond_or
	#	-> col_cond
	#	-> col_cond_or
	#	-> true
	#	-> false
	#   -> [epilogue]

is_coord_out_of_bounds__prologue:
	move	$t0, $a0						# &coord
	lw	$t1, ($t0)						# coord->row
	lw	$t2, 4($t0)						# coord->col

is_coord_out_of_bounds__body:

is_coord_out_of_bounds__row_cond:
	bgez	$t1, is_coord_out_of_bounds__row_cond_or		# if (coord->row < 0)
	b	is_coord_out_of_bounds__true

is_coord_out_of_bounds__row_cond_or:
	blt	$t1, BOARD_SIZE, is_coord_out_of_bounds__col_cond	# if (coord->row >= BOARD_SIZE)
	b 	is_coord_out_of_bounds__true

is_coord_out_of_bounds__col_cond:
	bgez	$t2, is_coord_out_of_bounds__col_cond_or		# if (coord->col < 0)
	b	is_coord_out_of_bounds__true

is_coord_out_of_bounds__col_cond_or:
	blt	$t2, BOARD_SIZE, is_coord_out_of_bounds__false		# if (coord->col >= BOARD_SIZE)

is_coord_out_of_bounds__true:
	li	$v0, TRUE						# return TRUE;
	b	is_coord_out_of_bounds__epilogue

is_coord_out_of_bounds__false:
	li	$v0, FALSE						# return FALSE;

is_coord_out_of_bounds__epilogue:
	jr	$ra							# return;


################################################################################
# .TEXT <is_overlapping>
.text
is_overlapping:
	# Args:
	#   - $a0: char[BOARD_SIZE][BOARD_SIZE] board
	#
	# Returns:
	#   - $v0: bool
	#
	# Frame:    []
	# Uses:     [$t0, $t1, $t2, $t3, $t4, $t5, $t6, $t7, $t8, $v0]
	# Clobbers: [$t0, $t1, $t2, $t3, $t4, $t5, $t6, $t7, $t8, $v0]
	#
	# Locals:
	#   - $t0: &start | temporary result
	#   - $t1: start.row
	#   - $t2: start.col
	#   - $t3: &end | temporary result
	#   - $t4: end.row
	#   - $t5: end.col
	#   - $t6: int col | int row
	#   - $t7: &board
	#   - $t8: temporary result
	#   - $v0: TRUE | FALSE
	#
	# Structure:
	#   is_overlapping
	#   -> [prologue]
	#   -> body
	#	-> if_cond
	#	-> if_for_init
	#	-> if_body
	#	   -> if_for_cond
	#	   -> if_for_body
	#	   -> if_for_empty
	#	   -> if_for_step
	#	-> else_cond
	#	-> else_for_init
	#	-> else_body
	#	   -> else_for_cond
	#	   -> else_for_body
	#	   -> else_for_empty
	#	   -> else_for_step
	#	-> true
	#	-> false
	#   -> [epilogue]

is_overlapping__prologue:
	la	$t0, start				# &start
	lw	$t1, ($t0)				# start.row
	lw	$t2, 4($t0)				# start.col

	la	$t3, end				# &end
	lw	$t4, ($t3)				# end.row
	lw	$t5, 4($t3)				# end.col

is_overlapping__body:

is_overlapping__if_cond:
	bne	$t1, $t4, is_overlapping__else_cond	# if (start.row == end.row)

is_overlapping__if_for_init:
	move	$t6, $t2				# int col = start.col

is_overlapping__if_body:

is_overlapping__if_for_cond:
	bgt	$t6, $t5, is_overlapping__false		# if (col <= end.col)

is_overlapping__if_for_body:
	move	$t7, $a0				# &board
	mul	$t0, $t1, BOARD_SIZE			# calculate &board[start.row][col]
	add	$t3, $t6, $t0
	add	$t7, $t7, $t3
	lb	$t8, ($t7)

is_overlapping__if_for_empty:
	bne	$t8, EMPTY, is_overlapping__true	# if (board[start.row][col] != EMPTY)

is_overlapping__if_for_step:
	addi	$t6, $t6, 1				# col++
	b	is_overlapping__if_for_cond

is_overlapping__else_cond:

is_overlapping__else_for_init:
	move	$t6, $t1				# int row = start.row

is_overlapping__else_body:

is_overlapping__else_for_cond:
	bgt	$t6, $t4, is_overlapping__false		# if (row <= end.row)

is_overlapping__else_for_body:
	move	$t7, $a0				# board[0][0]
	mul	$t0, $t6, BOARD_SIZE			# calculate &board[row][start.col]
	add	$t3, $t2, $t0
	add	$t7, $t7, $t3
	lb	$t8, ($t7)

is_overlapping__else_for_empty:
	bne	$t8, EMPTY, is_overlapping__true	# if (board[start.row][col] != EMPTY)

is_overlapping__else_for_step:
	addi	$t6, $t6, 1				# row++
	b 	is_overlapping__else_for_cond

is_overlapping__true:
	li	$v0, TRUE  				# return TRUE;
	b	is_overlapping__epilogue

is_overlapping__false:
	li	$v0, FALSE				# return FALSE;

is_overlapping__epilogue:
	jr	$ra					# return;


################################################################################
# .TEXT <place_ship_on_board>
.text
place_ship_on_board:
	# Args:
	#   - $a0: char[BOARD_SIZE][BOARD_SIZE] board
	#   - $a1: char ship_type
	#
	# Returns:  void
	#
	# Frame:    []
	# Uses:     [$t0, $t1, $t2, $t3, $t4, $t5, $t6, $t7, $t8]
	# Clobbers: [$t0, $t1, $t2, $t3, $t4, $t5, $t6, $t7, $t8]
	#
	# Locals:
	#   - $t0: &start | temporary result
	#   - $t1: start.row
	#   - $t2: start.col
	#   - $t3: &end | temporary result
	#   - $t4: end.row
	#   - $t5: end.col
	#   - $t6: int col | int row
	#   - $t7: &board
	#   - $t8: temporary result
	#
	# Structure:
	#   place_ship_on_board
	#   -> [prologue]
	#   -> body
	#	-> if_cond
	#	-> if_for_init
	#	-> if_body
	#	   -> if_for_cond
	#	   -> if_for_body
	#	   -> if_for_step
	#	-> else_cond
	#	-> else_for_init
	#	-> else_body
	#	   -> else_for_cond
	#	   -> else_for_body
	#	   -> else_for_step
	#   -> [epilogue]

place_ship_on_board__prologue:
	la	$t0, start				# start
	lw	$t1, ($t0)				# start.row
	lw	$t2, 4($t0)				# start.col

	la	$t3, end				# end
	lw	$t4, ($t3)				# end.row
	lw	$t5, 4($t3)				# end.col

place_ship_on_board__body:

place_ship_on_board__if_cond:
	bne	$t1, $t4, place_ship_on_board__else_cond	# if (start.row == end.row)

place_ship_on_board__if_for_init:
	move	$t6, $t2					# int col = start.col

place_ship_on_board__if_body:

place_ship_on_board__if_for_cond:
	bgt	$t6, $t5, place_ship_on_board__epilogue		# if (col <= end.col)

place_ship_on_board__if_for_body:
	move	$t7, $a0					# board[0][0]
	mul	$t0, $t1, BOARD_SIZE				# calculate &board[start.row][col]
	add	$t3, $t6, $t0
	add	$t7, $t7, $t3

	move	$t0, $a1					# ship_type	
	sb	$t0, ($t7)					# board[start.row][col] = ship_type;

place_ship_on_board__if_for_step:
	addi	$t6, $t6, 1					# col++
	b	place_ship_on_board__if_for_cond

place_ship_on_board__else_cond:

place_ship_on_board__else_init:
	move	$t6, $t1					# int row = start.row

place_ship_on_board__else_body:

place_ship_on_board__else_for_cond:
	bgt	$t6, $t4, place_ship_on_board__epilogue		# if (row <= end.row)

place_ship_on_board__else_for_body:
	move	$t7, $a0					# board[0][0]
	mul	$t0, $t6, BOARD_SIZE				# calculate &board[row][start.col]
	add	$t3, $t2, $t0
	add	$t7, $t7, $t3

	move	$t0, $a1					# ship_type
	sb	$t0, ($t7)					# board[row][start.col] = ship_type;

place_ship_on_board__else_for_step:
	addi	$t6, $t6, 1					# row++
	b 	place_ship_on_board__else_for_cond

place_ship_on_board__epilogue:
	jr	$ra						# return;


################################################################################
# .TEXT <play_game>
.text
play_game:
	# Args:     void
	#
	# Returns:  void
	#
	# Frame:    [$ra]
	# Uses:     [$s0, $a0]
	# Clobbers: [$s0, $a0]
	#
	# Locals:
	#   - $s0: saved &winner
	#
	# Structure:
	#   play_game
	#   -> [prologue]
	#   -> body
	#	-> init
	#	-> cond_none
	#	-> if_cond
	#	-> if_print_red
	#	-> else_cond
	#	-> else_print_blue
	#   -> [epilogue]

play_game__prologue:
	begin
	push	$ra

play_game__body:

play_game__init:
	li	$s0, WINNER_NONE			# int winner = WINNER_NONE;

play_game__cond_none:
	bne	$s0, WINNER_NONE, play_game__if_cond	# while (winner == WINNER_NONE)

	jal	play_turn				# play_turn();

	jal	check_winner				# winner = check_winner()
	move	$s0, $v0

	b 	play_game__cond_none				

play_game__if_cond:
	bne	$s0, WINNER_RED, play_game__else_cond	# if (winner == WINNER_RED)

play_game__if_print_red:
	li	$v0, 4
	la	$a0, red_wins_str			# printf("RED wins!\n");
	syscall

	b	play_game__epilogue

play_game__else_cond:

play_game__else_print_blue:
	li	$v0, 4
	la	$a0, blue_wins_str			# printf("BLUE wins!\n");
	syscall

play_game__epilogue:
	pop	$ra
	end

	jr	$ra		# return;


################################################################################
# .TEXT <play_turn>
.text
play_turn:
	# Args:     void
	#
	# Returns:  void
	#
	# Frame:    [$ra]
	# Uses:     [$t0, $t1, $t2, $t3, $a0]
	# Clobbers: [$t0, $t1, $t2, $t3, $a0]
	#
	# Locals:
	#   - $t0: whose_turn 
	#   - $t1: return value of is_coord_out_of_bounds(&target)
	#   - $t2: int hit_status
	#   - $t3: &target
	#
	# Structure:
	#   play_turn
	#   -> [prologue]
	#   -> body
	#	-> if_cond_turn
	#	-> if_print_blue
	#	-> else_cond_turn
	#	-> else_print_red
	#	-> target
	#	-> target_row
	#	-> target_col
	#	-> if_out_of_bounds
	#	-> if_print_out_of_bounds
	#	-> if_cond_hit_status
	#	-> if_body_hit_status
	#	-> else_cond_hit_status
	#	-> else_body_hit_status
	#	-> if_cond_invalid
	#	-> if_print_invalid
	#	-> if_cond_hit
	#	-> if_print_hit
	#	-> if_cond_miss
	#	-> if_print_miss
	#	-> swap_turn
	#   -> [epilogue]

play_turn__prologue:
	begin
	push	$ra

play_turn__body:

play_turn__if_cond_turn:
	lb	$t0, whose_turn
	bne	$t0, BLUE, play_turn__else_cond_turn	# if (whose_turn == BLUE)

play_turn__if_print_blue:
	li	$v0, 4					# printf("It is BLUE's turn!\n");
	la	$a0, blue_turn_str
	syscall

	la	$a0, blue_view				# print_board(blue_view);
	jal	print_board

	b 	play_turn__target

play_turn__else_cond_turn:

play_turn__else_print_red:
	li	$v0, 4					# printf("It is RED's turn!\n");
	la	$a0, red_turn_str
	syscall

	la	$a0, red_view				# print_board(red_view);
	jal	print_board

play_turn__target:

play_turn__target_row:
	la	$t3, target				# &target

	li	$v0, 4					# printf("Please enter the row for your target: ");
	la	$a0, enter_row_target_str
	syscall

	li	$v0, 5					# scanf("%d", &target.row);
	syscall
	sw	$v0, ($t3)

play_turn__target_col:
	li	$v0, 4					# printf("Please enter the column for your target: ");
	la	$a0, enter_col_target_str
	syscall

	li	$v0, 5					# scanf("%d", &target.col);
	syscall
	sw	$v0, 4($t3)

play_turn__if_out_of_bounds:
	move	$a0, $t3				# is_coord_out_of_bounds(&target)
	jal	is_coord_out_of_bounds
	move	$t1, $v0

	beqz	$t1, play_turn__if_cond_hit_status	# if (is_coord_out_of_bounds(&target)) 

play_turn__if_print_out_of_bounds:
	li	$v0, 4
	la	$a0, invalid_coords_out_bounds_str	# printf("Coordinates out of bounds. Try again.\n");
	syscall

	b 	play_turn__epilogue

play_turn__if_cond_hit_status:
	lb	$t0, whose_turn
	bne	$t0, BLUE, play_turn__else_cond_hit_status	# if (whose_turn == BLUE)

play_turn__if_body_hit_status:
	la	$a0, red_board				# perform_hit(red_board, blue_view)
	la 	$a1, blue_view
	jal	perform_hit
	move	$t2, $v0				# hit_status = perform_hit(red_board, blue_view);

	b 	play_turn__if_cond_invalid

play_turn__else_cond_hit_status:

play_turn__else_body_hit_status:
	la	$a0, blue_board				# perform_hit(blue_board, red_view)
	la 	$a1, red_view
	jal	perform_hit
	move	$t2, $v0				# hit_status = perform_hit(blue_board, red_view);

play_turn__if_cond_invalid:
	bne	$t2, INVALID, play_turn__if_cond_hit	# if (hit_status == INVALID)

play_turn__if_print_invalid:
	li	$v0, 4					# printf("You've already hit this target. Try again.\n");      
	la	$a0, invalid_coords_already_hit_str
	syscall

	b 	play_turn__epilogue

play_turn__if_cond_hit:
	bne	$t2, HIT, play_turn__if_cond_miss	# if (hit_status == HIT) 

play_turn__if_print_hit:
	li	$v0, 4					# printf("Successful hit!\n");
	la	$a0, hit_successful_str
	syscall

	b 	play_turn__epilogue

play_turn__if_cond_miss:

play_turn__if_print_miss:
	li	$v0, 4					# printf("Miss!\n");
	la	$a0, you_missed_str
	syscall

play_turn__swap_turn:
	jal	swap_turn				# swap_turn();

play_turn__epilogue:
	pop	$ra
	end

	jr	$ra					# return 0;


################################################################################
# .TEXT <perform_hit>
.text
perform_hit:
	# Args:
	#   - $a0: char their_board[BOARD_SIZE][BOARD_SIZE]
	#   - $a1: char our_view[BOARD_SIZE][BOARD_SIZE]
	#
	# Returns:
	#   - $v0: int
	#
	# Frame:    []
	# Uses:     [$t0, $t1, $t2, $t3, $t4, $t5, $t6, $t7, $t8, $v0]
	# Clobbers: [$t0, $t1, $t2, $t3, $t4, $t5, $t6, $t7, $t8, $v0]
	#
	# Locals:
	#   - $t0: &target
	#   - $t1: target.row
	#   - $t2: target.col
	#   - $t3: temporary result
	#   - $t4: temporary result
	#   - $t5: temporary result
	#   - $t6: temporary result
	#   - $t7: HIT | MISS
	#   - $t8: temporary result
	#   - $v0: INVALID | HIT | MISS
	#
	# Structure:
	#   perform_hit
	#   -> [prologue]
	#   -> body
	# 	-> if_cond_invalid
	# 	-> if_body_invalid
	# 	-> if_cond_hit
	# 	-> if_body_hit
	# 	-> if_cond_miss
	# 	-> if_body_miss
	# 	-> invalid
	# 	-> hit
	# 	-> miss
	#   -> [epilogue]

perform_hit__prologue:
	la	$t0, target				# &target
	lw	$t1, ($t0)				# target.row
	lw	$t2, 4($t0)				# target.col

perform_hit__body:

perform_hit__if_cond_invalid:
	move	$t5, $a1				# our_view[0][0]
	mul	$t6, $t1, BOARD_SIZE			# calculate &our_view[row][col]
	add	$t6, $t6, $t2
	add	$t5, $t5, $t6
	lb	$t8, ($t5)

	beq	$t8, EMPTY, perform_hit__if_cond_hit	# if (our_view[target.row][target.col] != EMPTY)

perform_hit__if_body_invalid:
	b	perform_hit__invalid

perform_hit__if_cond_hit:
	move	$t3, $a0				# their_board[0][0]
	mul	$t4, $t1, BOARD_SIZE			# calculate &their_board[row][col]
	add	$t4, $t4, $t2
	add	$t3, $t3, $t4
	lb	$t8, ($t3)

	beq	$t8, EMPTY, perform_hit__if_cond_miss	# if (their_board[target.row][target.col] != EMPTY)

perform_hit__if_body_hit:
	li	$t7, HIT				# our_view[target.row][target.col] = HIT;
	sb	$t7, ($t5)

	b 	perform_hit__hit

perform_hit__if_cond_miss:

perform_hit__if_body_miss:
	li	$t7, MISS				# our_view[target.row][target.col] = MISS;
	sb	$t7, ($t5)

	b 	perform_hit__miss

perform_hit__invalid:
	li	$v0, INVALID				# return INVALID;
	b 	perform_hit__epilogue

perform_hit__hit:
	li	$v0, HIT				# return HIT;
	b	perform_hit__epilogue

perform_hit__miss:
	li	$v0, MISS				# return MISS;

perform_hit__epilogue:
	jr	$ra					# return;


################################################################################
# .TEXT <check_winner>
.text
check_winner:
	# Args:	    void
	#
	# Returns:
	#   - $v0: int
	#
	# Frame:    [$ra]
	# Uses:     [$a0, $a1, $v0, $t0]
	# Clobbers: [$a0, $a1, $v0, $t0]
	#
	# Locals:
	#   - $v0: WINNER_BLUE | WINNER_RED | WINNER_NONE
	#   - $t0: temporary result
	#
	# Structure:
	#   check_winner
	#   -> [prologue]
	#   -> body
	#	-> if_blue_win
	#	-> if_red_win
	#	-> if_none_win
	#	-> blue
	#	-> red
	#	-> none
	#   -> [epilogue]

check_winner__prologue:
	begin
	push	$ra

check_winner__body:

check_winner__if_blue_win:	
	la	$a0, red_board			# check_player_win(red_board, blue_view)
	la	$a1, blue_view
	jal	check_player_win
	move	$t0, $v0

	bnez	$t0, check_winner__blue		# if (check_player_win(red_board, blue_view))

check_winner__if_red_win:
	la	$a0, blue_board			# check_player_win(blue_board, red_view)
	la	$a1, red_view
	jal	check_player_win
	move	$t0, $v0

	bnez	$t0, check_winner__red		# if (check_player_win(blue_board, red_view))

check_winner__if_none_win:
	b 	check_winner__none

check_winner__blue:
	li	$v0, WINNER_BLUE		# return WINNER_BLUE;
	b 	check_winner__epilogue

check_winner__red:
	li	$v0, WINNER_RED			# return WINNER_RED;
	b 	check_winner__epilogue

check_winner__none:
	li	$v0, WINNER_NONE		# return WINNER_NONE;

check_winner__epilogue:
	pop	$ra
	end

	jr	$ra				# return;


################################################################################
# .TEXT <check_player_win>
.text
check_player_win:
	# Args:
	#   - $a0: char[BOARD_SIZE][BOARD_SIZE] their_board
	#   - $a1: char[BOARD_SIZE][BOARD_SIZE] our_view
	#
	# Returns:
	#   - $v0: int
	#
	# Frame:    []
	# Uses:     [$t0, $t1, $t2, $t3, $t4, $t5, $t6, $t7, $v0]
	# Clobbers: [$t0, $t1, $t2, $t3, $t4, $t5, $t6, $t7, $v0]
	#
	# Locals:
	#   - $t0: int row
	#   - $t1: int col
	#   - $t2: temporary result
	#   - $t3: temporary result
	#   - $t4: temporary result
	#   - $t5: temporary result
	#   - $t6: temporary result
	#   - $t7: temporary result
	#   - $v0: TRUE | FALSE
	#
	# Structure:
	#   check_player_win
	#   -> [prologue]
	#   -> body
	#	-> for_row_init
	#	-> for_row_cond
	#	-> for_row_body
	#	   -> for_col_init
	#	   -> for_col_cond
	#	   -> for_col_body
	#		-> if_cond
	#		-> if_cond_and
	#		-> if_body
	#	   -> for_col_step
	#	-> for_row_step
	#	-> false
	#	-> true
	#   -> [epilogue]

check_player_win__prologue:

check_player_win__body:

check_player_win__for_row_init:
	li	$t0, 0						# int row = 0;

check_player_win__for_row_cond:
	bge	$t0, BOARD_SIZE, check_player_win__true		# if (row < BOARD_SIZE)

check_player_win__for_row_body:

check_player_win__for_col_init:
	li	$t1, 0						# int col = 0;

check_player_win__for_col_cond:
	bge	$t1, BOARD_SIZE, check_player_win__for_row_step # if (col < BOARD_SIZE)

check_player_win__for_col_body:

check_player_win__if_cond:
	move	$t2, $a0					# their_board[0][0]
	mul	$t3, $t0, BOARD_SIZE				# calculate &their_board[row][col]
	add	$t3, $t3, $t1
	add	$t2, $t2, $t3
	lb	$t6, ($t2)

	beq	$t6, EMPTY, check_player_win__for_col_step	# if (their_board[target.row][target.col] != EMPTY)

check_player_win__if_cond_and:
	move	$t4, $a1					# our_view[0][0]
	mul	$t5, $t0, BOARD_SIZE				# calculate &our_view[row][col]
	add	$t5, $t5, $t1
	add	$t4, $t4, $t5
	lb	$t7, ($t4)

	bne	$t7, EMPTY, check_player_win__for_col_step	# if (our_view[target.row][target.col] == EMPTY)

check_player_win__if_body:
	b 	check_player_win__false

check_player_win__for_col_step:
	addi	$t1, $t1, 1					# col++;
	b	check_player_win__for_col_cond

check_player_win__for_row_step:
	addi	$t0, $t0, 1					# row++;
	b 	check_player_win__for_row_cond

check_player_win__false:
	li	$v0, FALSE					# return FALSE;
	b	check_player_win__epilogue

check_player_win__true:
	li	$v0, TRUE					# return TRUE;

check_player_win__epilogue:
	jr	$ra						# return;


################################################################################
################################################################################
###                 PROVIDED FUNCTIONS — DO NOT CHANGE THESE                 ###
################################################################################
################################################################################


################################################################################
# .TEXT <print_board>
# YOU DO NOT NEED TO CHANGE THE PRINT_BOARD FUNCTION
.text
print_board:
	# Args:
	#   - $a0: char[BOARD_SIZE][BOARD_SIZE] board
	#
	# Returns:  void
	#
	# Frame:    [$ra, $s0]
	# Uses:     [$a0, $v0, $t0, $t1, $t2, $t3, $t4, $s0]
	# Clobbers: [$a0, $v0, $t0, $t1, $t2, $t3, $t4]
	#
	# Locals:
	#   - $s0: saved $a0
	#   - $t0: col, row
	#   - $t1: col
	#   - $t2: [row][col]
	#   - $t3: &board[row][col]
	#   - $t4: board[row][col]
	#
	# Structure:
	#   print_board
	#   -> [prologue]
	#   -> body
	#      -> for_header_init
	#      -> for_header_cond
	#      -> for_header_body
	#      -> for_header_step
	#      -> for_header_post
	#      -> for_row_init
	#      -> for_row_cond
	#      -> for_row_body
	#         -> for_col_init
	#         -> for_col_cond
	#         -> for_col_body
	#         -> for_col_step
	#         -> for_col_post
	#      -> for_row_step
	#      -> for_row_post
	#   -> [epilogue]

print_board__prologue:
	begin							# begin a new stack frame
	push	$ra						# | $ra
	push	$s0						# | $s0

print_board__body:
	move 	$s0, $a0

	li	$v0, 11						# syscall 11: print_char
	la	$a0, ' '					#
	syscall							# printf("%c", ' ');
	syscall							# printf("%c", ' ');

print_board__for_header_init:
	li	$t0, 0						# int col = 0;

print_board__for_header_cond:
	bge	$t0, BOARD_SIZE, print_board__for_header_post	# if (col >= BOARD_SIZE) goto print_board__for_header_post;

print_board__for_header_body:
	li	$v0, 1						# syscall 1: print_int
	move	$a0, $t0					#
	syscall							# printf("%d", col);

	li	$v0, 11						# syscall 11: print_char
	li	$a0, ' '					#
	syscall							# printf("%c", ' ');

print_board__for_header_step:
	addiu	$t0, 1						# col++;
	b	print_board__for_header_cond

print_board__for_header_post:
	li	$v0, 11						# syscall 11: print_char
	la	$a0, '\n'					#
	syscall							# printf("%c", '\n');

print_board__for_row_init:
	li	$t0, 0						# int row = 0;

print_board__for_row_cond:
	bge	$t0, BOARD_SIZE, print_board__for_row_post	# if (row >= BOARD_SIZE) goto print_board__for_row_post;

print_board__for_row_body:
	li	$v0, 1						# syscall 1: print_int
	move	$a0, $t0					#
	syscall							# printf("%d", row);

	li	$v0, 11						# syscall 11: print_char
	li	$a0, ' '					#
	syscall							# printf("%c", ' ');

print_board__for_col_init:
	li	$t1, 0						# int col = 0;

print_board__for_col_cond:
	bge	$t1, BOARD_SIZE, print_board__for_col_post	# if (col >= BOARD_SIZE) goto print_board__for_col_post;

print_board__for_col_body:
	mul	$t2, $t0, BOARD_SIZE				# &board[row][col] = (row * BOARD_SIZE
	add	$t2, $t2, $t1					#		      + col)
	mul	$t2, $t2, 1					# 		      * sizeof(char)
	add 	$t3, $s0, $t2					# 		      + &board[0][0]
	lb	$t4, ($t3)					# board[row][col]

	li	$v0, 11						# syscall 11: print_char
	move	$a0, $t4					#
	syscall							# printf("%c", board[row][col]);

	li	$v0, 11						# syscall 11: print_char
	li	$a0, ' '					#
	syscall							# printf("%c", ' ');

print_board__for_col_step:
	addi	$t1, $t1, 1					# col++;
	b	print_board__for_col_cond			# goto print_board__for_col_cond;

print_board__for_col_post:
	li	$v0, 11						# syscall 11: print_char
	li	$a0, '\n'					#
	syscall							# printf("%c", '\n');

print_board__for_row_step:
	addi	$t0, $t0, 1					# row++;
	b	print_board__for_row_cond			# goto print_board__for_row_cond;

print_board__for_row_post:
print_board__epilogue:
	pop	$s0						# | $s0
	pop	$ra						# | $ra
	end							# ends the current stack frame

	jr	$ra						# return;


################################################################################
# .TEXT <swap_turn>
.text
swap_turn:
	# Args:	    void
	#
	# Returns:  void
	#
	# Frame:    []
	# Uses:     [$t0]
	# Clobbers: [$t0]
	#
	# Locals:
	#
	# Structure:
	#   swap_turn
	#   -> body
	#      -> red
	#      -> blue
	#   -> [epilogue]

swap_turn__body:
	lb	$t0, whose_turn
	bne	$t0, BLUE, swap_turn__blue			# if (whose_turn != BLUE) goto swap_turn__blue;

swap_turn__red:
	li	$t0, RED					# whose_turn = RED;
	sb	$t0, whose_turn					# 
	
	j	swap_turn__epilogue				# return;

swap_turn__blue:
	li	$t0, BLUE					# whose_turn = BLUE;
	sb	$t0, whose_turn					# 

swap_turn__epilogue:
	jr	$ra						# return;

################################################################################
# .TEXT <get_end_row>
.text
get_end_row:
	# Args:
	#   - $a0: int  start_row
	#   - $a1: char direction
	#   - $a2: int  ship_len
	#
	# Returns:
	#   - $v0: int
	#
	# Frame:    [$ra]
	# Uses:     [$v0, $t0]
	# Clobbers: [$v0, $t0]
	#
	# Locals:
	#
	# Structure:
	#   get_end_row
	#   -> [prologue]
	#   -> body
	#   -> [epilogue]

get_end_row__prologue:
	begin							# begin a new stack frame
	push	$ra						# | $ra

get_end_row__body:
	move	$v0, $a0					
	beq	$a1, 'L', get_end_row__epilogue			# if (direction == 'L') return start_row;
	beq	$a1, 'R', get_end_row__epilogue			# if (direction == 'R') return start_row;

	sub	$t0, $a2, 1
	sub	$v0, $a0, $t0
	beq	$a1, 'U', get_end_row__epilogue			# if (direction == 'U') return start_row - (ship_len - 1);

	sub	$t0, $a2, 1
	add	$v0, $a0, $t0
	beq	$a1, 'D', get_end_row__epilogue			# if (direction == 'D') return start_row + (ship_len - 1);

	li	$v0, INVALID					# return INVALID;

get_end_row__epilogue:
	pop	$ra						# | $ra
	end							# ends the current stack frame

	jr	$ra						# return;


################################################################################
# .TEXT <get_end_col>
.text
get_end_col:
	# Args:
	#   - $a0: int  start_col
	#   - $a1: char direction
	#   - $a2: int  ship_len
	#
	# Returns:
	#   - $v0: int
	#
	# Frame:    [$ra]
	# Uses:     [$v0, $t0]
	# Clobbers: [$v0, $t0]
	#
	# Locals:
	#
	# Structure:
	#   get_end_col
	#   -> [prologue]
	#   -> body
	#   -> [epilogue]

get_end_col__prologue:
	begin							# begin a new stack frame
	push	$ra						# | $ra

get_end_col__body:
	move	$v0, $a0					
	beq	$a1, 'U', get_end_col__epilogue			# if (direction == 'U') return start_col;
	beq	$a1, 'D', get_end_col__epilogue			# if (direction == 'D') return start_col;

	sub	$t0, $a2, 1
	sub	$v0, $a0, $t0
	beq	$a1, 'L', get_end_col__epilogue			# if (direction == 'L') return start_col - (ship_len - 1);

	sub	$t0, $a2, 1
	add	$v0, $a0, $t0
	beq	$a1, 'R', get_end_col__epilogue			# if (direction == 'R') return start_col + (ship_len - 1);

	li	$v0, INVALID					# return INVALID;

get_end_col__epilogue:
	pop	$ra						# | $ra
	end							# ends the current stack frame

	jr	$ra						# return;
