const queue = [];

function enqueue(playerId) {
  queue.push(playerId);
  return queue.length;
}

function dequeue() {
  return queue.shift();
}

module.exports = { enqueue, dequeue };