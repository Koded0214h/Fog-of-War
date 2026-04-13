# Matric Number: 2201110082,
# Serial Number: 37

from scipy import stats

# Parameters
mu = 50    # Mean (f)
sigma = 5  # Standard deviation (w)

# i) Proportion of students taking less than 30 seconds
x1 = 30
z1 = (x1 - mu) / sigma
# cdf (Cumulative Distribution Function) gives the area to the left of z
prop1 = stats.norm.cdf(z1)

print(f"i) Less than 30 seconds:")
print(f"   Z-score: {z1}")
print(f"   Proportion: {prop1:.5f}")
print(f"   Percentage: {prop1 * 100:.3f}%")

# ii) Proportion of students taking between 30 and 45 seconds
x2 = 45
z2 = (x2 - mu) / sigma
# We subtract the area below 30 from the area below 45
prop2 = stats.norm.cdf(z2) - stats.norm.cdf(z1)

print(f"\nii) Between 30 and 45 seconds:")
print(f"    Z-score for 45s: {z2}")
print(f"    Proportion: {prop2:.5f}")
print(f"    Percentage: {prop2 * 100:.2f}%")