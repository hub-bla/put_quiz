#include <queue>
#include <semaphore.h>
#include <sstream>
#include <string>
#include <sys/epoll.h>
#include <vector>

void add_write_flag(const int &epoll_fd, const int &client_fd);

std::vector<std::string> split(const std::string &str, char delimiter);

template <typename T> class SemaphoreQueue {
private:
  std::queue<T> queue;
  pthread_mutex_t mtx;
  sem_t sem;

public:
  SemaphoreQueue() {
    pthread_mutex_init(&mtx, nullptr); // Initialize the mutex
    sem_init(&sem, 0, 0);              // Initialize semaphore with 0 (no items)
  }

  ~SemaphoreQueue() {
    pthread_mutex_destroy(&mtx); // Destroy the mutex
    sem_destroy(&sem);           // Destroy the semaphore
  }

  void push(const T item) {
    pthread_mutex_lock(&mtx);
    queue.push(item);
    pthread_mutex_unlock(&mtx);
    sem_post(&sem);
  }

  T pop() {
    sem_wait(&sem);
    pthread_mutex_lock(&mtx);
    T item = queue.front();
    queue.pop();
    pthread_mutex_unlock(&mtx);
    return item;
  }
};