from django.core.management.base import BaseCommand
from django.utils import timezone
from articles.models import Article, Category
from users.models import User


class Command(BaseCommand):
    help = 'Create articles for featured women profiles'

    def handle(self, *args, **options):
        # Get or create the category
        category, _ = Category.objects.get_or_create(
            slug='featured',
            defaults={
                'name': 'Featured Stories',
                'description': 'Featured stories of godly women'
            }
        )

        # Get or create users
        users_data = [
            {'email': 'winnie.adoma@godlywomen.com', 'name': 'Winnie Adoma'},
            {'email': 'hellen.ojwang@godlywomen.com', 'name': 'Hellen Ojwang'},
            {'email': 'harriet.madam@godlywomen.com', 'name': 'Madam Harriet'},
        ]

        users = {}
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                email=user_data['email'],
                defaults={'name': user_data['name']}
            )
            users[user_data['name']] = user
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Created user: {user.name}'))

        # Articles data
        articles_data = [
            {
                'title': 'Winnie Adoma: Vision and Leadership in Business',
                'slug': 'winnie-adoma-vision-leadership',
                'author_name': 'Winnie Adoma',
                'excerpt': 'Discover how Winnie Adoma is transforming the landscape of women in business through faith and excellence.',
                'content': '''<h2>A Visionary Leader</h2>
<p>Winnie Adoma stands as a beacon of hope and inspiration for women across Africa seeking to combine business acumen with spiritual conviction. With over 15 years of experience in business development, she has dedicated her life to empowering other women to reach their fullest potential in their professional callings.</p>

<h2>Founding Mission</h2>
<p>As the founder of Godly Women in Business, Winnie envisioned a community where women would not have to compromise their faith to succeed in the corporate world. Her mission is clear: create spaces where women can excel professionally while maintaining their spiritual integrity and deepening their relationship with God.</p>

<h2>Leadership Philosophy</h2>
<p>Winnie's leadership philosophy is rooted in the belief that true success is not measured by wealth alone, but by the positive impact we have on our communities and the legacy we leave for future generations. She believes that godly principles should guide all business decisions, from employee treatment to corporate responsibility.</p>

<h2>Impact and Vision</h2>
<p>Through Godly Women in Business, Winnie has directly mentored hundreds of women entrepreneurs, professionals, and business leaders. Her work has helped women establish successful businesses, secure leadership positions in major corporations, and become economic pillars in their communities. Yet she remains humble, crediting her success to God's guidance and the support of her community.</p>

<h2>A Living Testimony</h2>
<p>Winnie's life is a testament to the power of faith combined with hard work, strategic thinking, and genuine compassion for others. She continues to inspire through her speaking engagements, mentorship programs, and her unwavering commitment to lifting other women as she climbs.</p>'''
            },
            {
                'title': 'Hellen Ojwang: Grace, Wisdom, and Service',
                'slug': 'hellen-ojwang-grace-wisdom',
                'author_name': 'Hellen Ojwang',
                'excerpt': 'Learn about Hellen Ojwang\'s journey of faith, excellence, and service in the professional world.',
                'content': '''<h2>An Accomplished Professional</h2>
<p>Hellen Ojwang embodies the perfect blend of professional excellence and genuine compassion. Her career journey has taken her through various industries, and in each role, she has distinguished herself not just through her competence, but through her character and integrity.</p>

<h2>The Art of Gracious Leadership</h2>
<p>What sets Hellen apart is her unique ability to lead with grace. She believes that authority gained through grace is far more powerful than authority gained through fear. In every organization she has worked with, Hellen has been known for developing her team members, celebrating their successes, and helping them grow beyond their own expectations.</p>

<h2>Wisdom from Experience</h2>
<p>Hellen's wisdom is not academic but hard-earned through years of navigating complex professional landscapes with faith as her compass. She has faced challenges that would have broken many, yet she emerged stronger, more faithful, and more committed to serving others. Her colleagues and mentees speak of her ability to see situations not just through a business lens, but through a lens of human dignity and God's purpose.</p>

<h2>A Servant's Heart</h2>
<p>At her core, Hellen is a servant. Whether in the boardroom or at community events, her first instinct is to ask, "How can I help?" This servant's heart has won her respect and admiration across all circles. She mentors young professionals, volunteers in her community, and dedicates significant time to causes she believes in.</p>

<h2>Inspiring Others to Excellence</h2>
<p>Hellen's greatest joy comes from seeing others succeed. She has dedicated herself to creating opportunities for talented women and men to shine, believing that a rising tide lifts all boats. Her legacy will not be measured by titles held or money earned, but by the lives touched and futures brightened through her influence.</p>'''
            },
            {
                'title': 'Madam Harriet: Hope, Generosity, and Faith',
                'slug': 'madam-harriet-hope-generosity',
                'author_name': 'Madam Harriet',
                'excerpt': 'Discover the inspiring story of Madam Harriet and her transformative impact on countless lives.',
                'content': '''<h2>A Beacon of Hope</h2>
<p>Madam Harriet is known throughout her community as someone who brings hope wherever she goes. In a world full of challenges and setbacks, she refuses to lose sight of the good that can be done when faith guides our actions. Her unwavering belief in God's provision and care has been contagious, inspiring many to persevere through their own difficult seasons.</p>

<h2>The Power of Generosity</h2>
<p>Harriet's generosity is legendary. Those who know her speak of her remarkable ability to give—not just of her resources, but of her time, attention, and genuine care. She has supported countless individuals through their darkest hours, offering not just material help but emotional and spiritual support. Her generosity flows from a deep well of gratitude for what God has blessed her with.</p>

<h2>Transformed Lives</h2>
<p>The stories of those whose lives have been touched by Madam Harriet are countless. From young women escaping difficult circumstances to families rebuilding after loss, her quiet interventions have changed trajectories. Yet she never seeks recognition or thanks. For Harriet, the reward is simply seeing others flourish and knowing that she has been part of God's work in their lives.</p>

<h2>Servant Leadership in Action</h2>
<p>Madam Harriet embodies servant leadership in its purest form. She believes that leadership is not about position or power, but about availability to serve. Whether through formal charitable work or informal mentorship, she shows up for people. Her life demonstrates that true strength is found in humility and true influence comes through genuine care.</p>

<h2>A Living Legacy</h2>
<p>Though Madam Harriet would likely downplay the significance of her work, her legacy is undeniable. Generations of women have learned from her example what it means to live with faith, generosity, and purpose. She continues to be a living testimony that one person, armed with faith and a willing heart, can indeed transform their community.</p>'''
            }
        ]

        # Create articles
        for article_data in articles_data:
            article, created = Article.objects.get_or_create(
                slug=article_data['slug'],
                defaults={
                    'title': article_data['title'],
                    'author': users[article_data['author_name']],
                    'category': category,
                    'excerpt': article_data['excerpt'],
                    'content': article_data['content'],
                    'status': 'published',
                    'published_at': timezone.now(),
                    'created_at': timezone.now(),
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Created article: {article.title}'))
            else:
                self.stdout.write(f'→ Article already exists: {article.title}')

        self.stdout.write(self.style.SUCCESS('All articles created successfully!'))
