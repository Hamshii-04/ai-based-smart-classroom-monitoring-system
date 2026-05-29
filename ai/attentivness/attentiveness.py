import random


def get_attentiveness():

    score = random.uniform(0, 1)

    if score > 0.7:
        return "Attentive"

    elif score > 0.4:
        return "Inattentive"

    else:
        return "Drowsy"