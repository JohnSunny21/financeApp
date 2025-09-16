# let's start with an official python image. 
FROM python:3.9-bookworm

# Setting the working directory inside the container
WORKDIR /app

# Copy the file that lists our dependencies.
COPY requirements.txt .



# Before run this for ugrading pip
RUN pip install --upgrade pip
# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of our application code

COPY . .


# Expose the port the app runs on 
EXPOSE 5001

# The commmand to run when the container starts
# We use gunicorn (green unicorn) for a more production-ready server than FLask's built-in one.
CMD ["gunicorn","--bind","0.0.0.0:5001","app:app"]
