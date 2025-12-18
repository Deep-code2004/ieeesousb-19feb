import pygame
import math
import sys

# Initialize pygame
pygame.init()

# Screen settings
WIDTH, HEIGHT = 800, 800
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Heart Animation")

clock = pygame.time.Clock()

# Colors
BLACK = (0, 0, 0)
RED = (255, 0, 0)

# Center of screen
cx, cy = WIDTH // 2, HEIGHT // 2

# Heart equation function
def heart(t):
    x = 16 * math.sin(t) ** 3
    y = (
        13 * math.cos(t)
        - 5 * math.cos(2 * t)
        - 2 * math.cos(3 * t)
        - math.cos(4 * t)
    )
    return x, y

scale_base = 15
pulse_angle = 0.0
rotation = 0.0

# Precompute base heart points (untransformed)
steps = 360
base_points = []
for i in range(steps):
    t = 2 * math.pi * i / steps
    x, y = heart(t)
    base_points.append((x * scale_base, y * scale_base))

# Animation control
current_index = 0
progress = 0.0
progress_step = 0.18  
outline_frames = 12
outline_counter = 0
hold_frames = 20
hold_counter = 0
phase = "outline" 
completed = [False] * steps

# Main loop
while True:
    screen.fill(BLACK)

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    # Pulsing (no rotation)
    pulse = 1.0 + 0.08 * math.sin(pulse_angle)
    pulse_angle += 0.12

    # Transform points for current frame (scale only)
    transformed = []
    for x, y in base_points:
        xs = x * pulse
        ys = y * pulse
        transformed.append((cx + xs, cy - ys))

    # Phase 1: draw outline
    if phase == "outline":
        pygame.draw.aalines(screen, (180, 0, 0), True, transformed)
        outline_counter += 1
        if outline_counter >= outline_frames:
            phase = "contract"
            outline_counter = 0

    # Phase 2: sequentially contract lines toward center
    elif phase == "contract":
        # faint outline behind
        pygame.draw.aalines(screen, (80, 80, 80), True, transformed)

        # draw already completed dark lines
        for i in range(steps):
            if completed[i]:
                px, py = transformed[i]
                pygame.draw.line(screen, (120, 0, 0), (cx, cy), (px, py), 2)

        # animate current line contracting
        if current_index < steps:
            sx, sy = transformed[current_index]
            ex, ey = cx, cy
            # interpolate endpoint from outline toward center
            ix = sx * (1 - progress) + ex * progress
            iy = sy * (1 - progress) + ey * progress
            pygame.draw.aaline(screen, RED, (cx, cy), (ix, iy))

            progress += progress_step
            if progress >= 1.0:
                # mark as completed (dark full line)
                completed[current_index] = True
                progress = 0.0
                current_index += 1
        else:
            phase = "hold"

    # Phase 3: hold completed heart, then reset
    elif phase == "hold":
        for i in range(steps):
            px, py = transformed[i]
            pygame.draw.line(screen, (120, 0, 0), (cx, cy), (px, py), 2)
        hold_counter += 1
        if hold_counter >= hold_frames:
            # reset for next loop
            current_index = 0
            progress = 0.0
            completed = [False] * steps
            hold_counter = 0
            phase = "outline"

    pygame.display.flip()
    clock.tick(60)
