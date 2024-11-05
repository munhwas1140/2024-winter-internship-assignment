function friendRecommendations(network, user) {
    let ans = []

    let visited = [...network[user], user]

    let queue = [...network[user]]
    while (queue.length !== 0) { 
        const now = queue.shift();
        network[now].forEach(next => {
            if (!visited.includes(next)) {
                queue.push(next)
                visited.push(next)
                ans.push(next)
            }
        });
    }
    return ans
}