import numpy as np
import matplotlib as pyplot

# first off assume probabilty is equal to char index.


def error(examples, a, b):
    total = 0
    for x,y in examples:
        pred = sigma(x, a, b)
        total += pow(y-pred, 2)

    return total


# def optimise(examples):
#     c_low = -2000
#     c_high = 0
#     s_low = 0
#     s_high = .1

#     s = (s_low + s_high)/2
#     for i in range(10):
#         err1 = error(examples, s, c_low)
#         err2 = error(examples, s, c_high)
#         print(err1, err2)
#         print(c_low,c_high)
#         if (err1 < err2):
#             c_high = (c_low + c_high)/2
#         else:
#             c_low = (c_low + c_high)/2

#     return(c_low, c_high)

def grad(examples):
    c = -1000
    s = 0.1
    lr = 0.02
    for i in range(10):
        gc = 0
        gs = 0
        for j in examples:
            gc += dbsigma(i, c, s)
            gs += dasigma(i, c, s)
            print(gc,gs)
        c += lr * gc
        c += lr * gs
        err = error(examples, s, c)
        print(err)


    return (c, s)

def sigma(x, a, b):
    return 1/(1+np.exp(a*(x+b)))

def dbsigma(x, a, b):
    return -a*np.exp(a*(x+b))/np.square(1+np.exp(a*(x+b)))

def dasigma(x, a, b):
    return  (x+b)*np.exp(a*(x+b))/np.square(1+np.exp(a*(x+b)))



indx = [(1, 1), (100, 1), (250, 1), (300, 1), (700, 0)]

print(grad(indx))



# for i in range(0, 1000, 100):
#     print(error(indx, .1, i))
