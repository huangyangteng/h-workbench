export function formatArticle(data) {
    return data.map(item => {
        return {
            id: item.article_id,
            title: item.article_info.title,
            viewCount: item.article_info.view_count,
            starCount: item.article_info.digg_count
        }
    })
}
