
import { CONTENT_DB } from './src/data/content_db';

const checkData = () => {
  const posts = CONTENT_DB.blog_posts;
  console.log(`Total posts found: ${posts.length}`);
  
  const issues = [];
  posts.forEach(post => {
    if (!post.contentBody) {
      issues.push(`ID ${post.id}: Missing contentBody`);
    } else {
      const { introduction, core_analysis, practical_guide, conclusion } = post.contentBody;
      if (!introduction || !introduction.heading || !introduction.text) issues.push(`ID ${post.id}: Incomplete introduction`);
      if (!core_analysis || core_analysis.length === 0) issues.push(`ID ${post.id}: Missing core_analysis`);
      if (!practical_guide || !practical_guide.heading || !practical_guide.items) issues.push(`ID ${post.id}: Incomplete practical_guide`);
      if (!conclusion || !conclusion.text || !conclusion.closing_statement) issues.push(`ID ${post.id}: Incomplete conclusion`);
    }
  });

  if (issues.length === 0) {
    console.log("All posts validated successfully!");
  } else {
    console.log("Validation issues found:");
    issues.forEach(i => console.log(`- ${i}`));
  }
};

checkData();
