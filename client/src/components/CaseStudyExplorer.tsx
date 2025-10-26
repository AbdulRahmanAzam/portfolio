import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { portfolioData } from '@shared/schema';
import { Brain, Globe, ExternalLink, Github, FileText } from 'lucide-react';

export function CaseStudyExplorer() {
  const [filter, setFilter] = useState<'all' | 'web' | 'aiml'>('all');

  const filteredProjects = useMemo(() => {
    if (filter === 'all') return portfolioData.projects;
    return portfolioData.projects.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <section
      id="case-studies"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30"
      data-testid="section-case-studies"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
            Case Study Explorer
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Filter projects by domain to see focused expertise
          </p>

          {/* Filter buttons */}
          <div className="flex justify-center gap-3 flex-wrap">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="lg"
              onClick={() => setFilter('all')}
              className="min-w-32"
            >
              All Projects
              <Badge variant="secondary" className="ml-2">
                {portfolioData.projects.length}
              </Badge>
            </Button>
            <Button
              variant={filter === 'web' ? 'default' : 'outline'}
              size="lg"
              onClick={() => setFilter('web')}
              className="min-w-32"
            >
              <Globe className="w-4 h-4 mr-2" />
              Web Dev
              <Badge variant="secondary" className="ml-2">
                {portfolioData.projects.filter((p) => p.category === 'web').length}
              </Badge>
            </Button>
            <Button
              variant={filter === 'aiml' ? 'default' : 'outline'}
              size="lg"
              onClick={() => setFilter('aiml')}
              className="min-w-32"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI/ML
              <Badge variant="secondary" className="ml-2">
                {portfolioData.projects.filter((p) => p.category === 'aiml').length}
              </Badge>
            </Button>
          </div>
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="p-6 flex flex-col hover-elevate transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="text-xs">
                  {project.category === 'aiml' ? (
                    <>
                      <Brain className="w-3 h-3 mr-1" />
                      AI/ML
                    </>
                  ) : (
                    <>
                      <Globe className="w-3 h-3 mr-1" />
                      Web
                    </>
                  )}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">{project.period}</span>
              </div>

              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{project.title}</h3>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                {project.description}
              </p>

              {/* Impact metrics */}
              {project.impact && project.impact.length > 0 && (
                <div className="mb-4 pb-4 border-b border-border">
                  <div className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">
                    Key Metrics
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {project.impact.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="rounded-md bg-muted/50 p-2">
                        <div className="text-xs text-muted-foreground truncate">{item.metric}</div>
                        <div className="text-sm font-semibold truncate">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies */}
              <div className="flex flex-wrap gap-1 mb-4">
                {project.technologies.slice(0, 3).map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {project.technologies.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{project.technologies.length - 3}
                  </Badge>
                )}
              </div>

              {/* Links */}
              {project.links && (
                <div className="flex flex-wrap gap-2 mt-auto">
                  {'demo' in project.links && project.links.demo && (
                    <Button size="sm" variant="outline" asChild className="flex-1">
                      <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Demo
                      </a>
                    </Button>
                  )}
                  {'github' in project.links && project.links.github && (
                    <Button size="sm" variant="outline" asChild className="flex-1">
                      <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-3 h-3 mr-1" />
                        Code
                      </a>
                    </Button>
                  )}
                  {'modelCard' in project.links && project.links.modelCard && (
                    <Button size="sm" variant="outline" asChild className="flex-1">
                      <a href={project.links.modelCard} target="_blank" rel="noopener noreferrer">
                        <FileText className="w-3 h-3 mr-1" />
                        Model
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
